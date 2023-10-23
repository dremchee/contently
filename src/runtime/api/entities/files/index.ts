import { fileService } from "./service";
import type { RouteOptions } from "../../types";
import { buildResponse, buildResponseError } from "../../utils/helpers";
import { existsSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { extname } from "node:path";
import { Readable } from "node:stream";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { config } from "../../const";
import { z } from "zod";

import {
  getQuery,
  readFormData,
  getRouterParam,
  setResponseHeaders,
  sendStream,
  getValidatedQuery,
} from "h3";
import { nanoid } from "nanoid";

const all: RouteOptions = {
  url: "files",
  method: "get",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const query = getQuery<{
      type?: string;
      limit?: number;
      skip?: number;
    }>(event);

    const params = {
      type: query.type,
      limit: Number(query.limit || 20),
      skip: Number(query.skip || 0),
    };
    return buildResponse(await fileService.all(params));
  },
};

const findById: RouteOptions = {
  url: "files/:id",
  method: "get",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const id = getRouterParam(event, "id");
    if (!id) {
      return false;
    }
    const response = await fileService.findById(id);
    return buildResponse(response);
  },
};

const removeById: RouteOptions = {
  url: "files/:id",
  method: "delete",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const id = getRouterParam(event, "id");
    if (!id) {
      return false;
    }
    const response = await fileService.removeById(id);

    return buildResponse(response);
  },
};

const previewByIdPublic: RouteOptions = {
  url: "assets/:id",
  method: "get",
  async handler(event) {
    const id = getRouterParam(event, "id");

    if (!id) {
      return false;
    }

    const schema = z.object({
      width: z
        .string()
        .optional()
        .transform((e) => Number(e) || undefined),
      height: z
        .string()
        .optional()
        .transform((e) => Number(e) || undefined),
      quality: z
        .string()
        .optional()
        .transform((e) => Number(e) || undefined),
    });

    const query = (await getValidatedQuery(event, schema.safeParse)) as {
      success: boolean;
      data: { width: number; height: number; quality: number };
    };

    const resize = {
      width: query.data.width,
      height: query.data.height,
    };

    const assets = await fileService.preview(id, {
      resize,
      quality: query.data.quality,
    });

    if (assets) {
      setResponseHeaders(event, {
        "Content-Type": assets.info.type,
        "Content-Length": assets.info.size,
      });

      const stream = Readable.from(assets.data);

      return sendStream(event, stream);
    } else {
      return buildResponseError(event, 404);
    }
  },
};

const upload: RouteOptions = {
  url: "files/upload",
  method: "post",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const body = await readFormData(event);

    if (body) {
      try {
        const [[_, src]] = body;
        const file = src as File;
        const uploadsDir = resolve(process.cwd(), config.uploadsPath);
        const buffer = Buffer.from(await file.arrayBuffer());

        const hash = createHash("md5").update(buffer).digest("hex");
        const data = {
          name: `${nanoid()}${extname(file.name)}`,
          originName: file.name,
          hash,
          type: file.type,
          size: file.size,
        };

        const path = resolve(uploadsDir, data.name);

        try {
          const fileData = await fileService.create(data);

          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir);
          }

          await writeFile(path, buffer);

          return buildResponse(fileData);
        } catch (err) {
          return buildResponseError(event, 409, "This file already exists");
        }
      } catch (error) {
        console.log(error);
      }
    }
    return buildResponseError(event, 400);
  },
};

export { upload, all, findById, removeById, previewByIdPublic };
