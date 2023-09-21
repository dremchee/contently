import { File, DocumentType } from "../../types";
import sharp, { ResizeOptions, FormatEnum } from "sharp";
import { lookup, extension } from "mime-types";
import { resolve } from "node:path";
import { unlinkSync, readFileSync } from "node:fs";
import { ApiService } from "../../api";

class FileService extends ApiService {
  constructor() {
    super("files");
    this.db.ensureIndex({ fieldName: "hash", unique: true });
  }

  async all(params: { type?: string; limit: number; skip: number }) {
    const total = await this.db.countAsync({});
    const files = await this.db
      .findAsync<File>({
        $where: function () {
          if (params.type) {
            return this.type.startsWith(params.type);
          }

          return true;
        },
      })
      .sort({
        createdAt: -1,
      })
      .limit(params.limit)
      .skip(params.skip);

    return {
      limit: params.limit,
      skip: params.skip,
      total,
      items: files.map((file) => {
        return {
          ...file,
          path: `${this.config.uploadsPath}/${file.name}`,
        };
      }),
    };
  }

  async findById(id: string) {
    return this.db.findOneAsync<DocumentType<File>>({
      _id: id,
    });
  }

  async findByHash(id: string) {
    return this.db.findOneAsync<DocumentType<File>>({
      _id: id,
    });
  }

  async create(params: {
    name: string;
    hash: string;
    type: string;
    size: number;
  }) {
    const data = {
      ...params,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return await this.db.insertAsync(data);
  }

  async removeById(id: string) {
    const response = await this.findById(id);

    if (response) {
      const filepath = resolve(
        process.cwd(),
        `${this.config.uploadsPath}/${response.name}`
      );
      try {
        await unlinkSync(filepath);
      } catch (err) {
        console.log(err);
      }

      const removed = await this.db.removeAsync(
        {
          _id: response._id,
        },
        {}
      );

      if (removed) {
        return response;
      }
    }
  }

  async preview(
    id: string,
    options?: {
      resize?: ResizeOptions;
      format?: keyof FormatEnum;
      quality?: number;
    }
  ) {
    const response = await this.findById(id);

    if (response) {
      const filepath = resolve(
        process.cwd(),
        `${this.config.uploadsPath}/${response.name}`
      );

      if (response.type.startsWith("image")) {
        const image = sharp(filepath);

        if (options?.resize) {
          image.resize(options.resize);
        }

        if (options?.format) {
          image.toFormat(
            options?.format || (extension(response.type) as keyof FormatEnum),
            {
              quality: options?.quality || 100,
            }
          );
        }
        const { data, info } = await image.toBuffer({
          resolveWithObject: true,
        });

        return {
          info: {
            type: lookup(info.format) || response.type,
            size: info.size,
          },
          data,
        };
      }

      return {
        info: {
          type: response.type,
          size: response.size,
        },
        data: readFileSync(filepath),
      };
    }
  }
}

export const fileService = new FileService();
