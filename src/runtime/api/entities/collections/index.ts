import { Collections, DocumentType, RouteOptions } from "../../types";
import { collectionService } from "./service";
import { buildResponse, buildResponseError } from "../../utils/helpers";
import { getRouterParam, getQuery, readBody } from "h3";
import { validateBody, Type } from "h3-typebox";
import { settingsService } from "../settings/service";

const collectionsSchema = Type.Object({
  key: Type.String({ minLength: 1 }),
  name: Type.String({ minLength: 1 }),
  singleton: Type.Boolean(),
});

const collectionSchema = Type.Object({
  key: Type.String({ minLength: 1 }),
});

function findDuplicate(arr: string[]) {
  const duplicates: Record<string, boolean> = {};
  const result: string[] = [];

  for (const value of arr) {
    if (duplicates[value]) {
      if (!result.includes(value)) {
        result.push(value);
      }
    } else {
      duplicates[value] = true;
    }
  }

  return result;
}

const all: RouteOptions = {
  url: "collections",
  method: "get",
  async handler() {
    const collections = await collectionService.findAll();

    return buildResponse(collections);
  },
};

const create: RouteOptions = {
  url: "collections",
  method: "post",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const data = await validateBody(event, collectionsSchema);

    try {
      return buildResponse(await collectionService.create(data));
    } catch (error) {
      return buildResponseError(event, 400);
    }
  },
};

const findById: RouteOptions = {
  url: "collections/:id",
  method: "get",
  async handler(event) {
    const id = getRouterParam(event, "id");
    const query = getQuery(event) as { limit?: number; skip?: number };

    const options = {
      limit: Number(query.limit),
      skip: Number(query.skip),
    };

    if (id) {
      const collections = await collectionService.findCollectionById(
        id,
        options
      );
      return buildResponse(collections);
    }
  },
};

const removeById: RouteOptions = {
  url: "collections/:id",
  method: "delete",
  async handler(event) {
    const id = getRouterParam(event, "id");
    if (id) {
      const collections = await collectionService.removeCollectionById(id);
      return buildResponse(collections);
    }
  },
};

const publicFindByKey: RouteOptions = {
  url: "public/collections/:key",
  method: "get",
  async handler(event) {
    const key = getRouterParam(event, "key");
    if (key) {
      const collections = await collectionService.findCollectionByKey(key);
      return buildResponse(collections);
    }
  },
};

const publicFindByKeyResource: RouteOptions = {
  url: "public/collections/:key/resource/:child",
  method: "get",
  async handler(event) {
    const key = getRouterParam(event, "key");
    const child = getRouterParam(event, "child");
    if (key && child) {
      const collections = await collectionService.findCollectionByResourceKey(
        key,
        child
      );
      return buildResponse(collections);
    }
  },
};

const findByResourceId: RouteOptions = {
  url: "collections/:id/resource/:resourceId",
  method: "get",
  async handler(event) {
    const parentId = getRouterParam(event, "id");
    const resourceId = getRouterParam(event, "resourceId");
    if (parentId && resourceId) {
      const collections = await collectionService.findCollectionByResourceId(
        parentId,
        resourceId
      );
      return buildResponse(collections);
    }
  },
};

const createById: RouteOptions = {
  url: "collections/:id",
  method: "post",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const data = await validateBody(event, collectionSchema);
    const id = getRouterParam(event, "id");

    if (id) {
      const result = await collectionService.createCollectionById(id, data);
      return buildResponse(result);
    }
  },
};

const updateById: RouteOptions = {
  url: "collections/:id",
  method: "put",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const data = (await readBody(event)) as Collections;
    const id = getRouterParam(event, "id");

    if (id) {
      const duplicateKeys = findDuplicate(data.fields.map((e) => e.key));

      if (!duplicateKeys.length) {
        const result = await collectionService.updateCollectionById(id, data);
        return buildResponse(result);
      } else {
        return buildResponseError(
          event,
          409,
          `Dublicale keys: ${duplicateKeys}`
        );
      }
    }
  },
};

const updateByResourceId: RouteOptions = {
  url: "collections/:id/resource/:resourceId",
  method: "put",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const data = await readBody(event);
    const parentId = getRouterParam(event, "id");
    const resourceId = getRouterParam(event, "resourceId");
    if (parentId && resourceId) {
      const result = await collectionService.updateCollectionByResourceId(
        parentId,
        resourceId,
        data
      );
      return buildResponse(result);
    }
  },
};

const removeByResourceId: RouteOptions = {
  url: "collections/:id/resource/:resourceId",
  method: "delete",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const parentId = getRouterParam(event, "id");
    const resourceId = getRouterParam(event, "resourceId");
    if (parentId && resourceId) {
      const result = await collectionService.removeCollectionByResourceId(
        parentId,
        resourceId
      );
      return buildResponse(result);
    }
  },
};

const insertById: RouteOptions = {
  url: "collections/:id/insert",
  method: "post",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (id) {
      const result = await collectionService.insertData(String(id), body);
      return buildResponse(result);
    }
  },
};

export {
  all,
  create,
  findById,
  findByResourceId,
  createById,
  removeById,
  publicFindByKey,
  publicFindByKeyResource,
  updateById,
  updateByResourceId,
  removeByResourceId,
  insertById,
};
