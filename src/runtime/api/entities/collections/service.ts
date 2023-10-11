import {
  DocumentType,
  Collections,
  Field,
  FieldType,
  Collection,
} from "../../types";
import { ApiService } from "../../api";
import { settingsService } from "../settings/service";

class CollectionService extends ApiService {
  constructor() {
    super("collections");
    this.db.ensureIndexAsync({ fieldName: "key", unique: true });
  }

  async findAll() {
    const orders = await settingsService.getSettingsOrder("collections");
    const collections = await this.db
      .findAsync<DocumentType<Collections>>({})
      .sort({
        createdAt: -1,
      });

    const data = Promise.all(
      orders.map(async (id) => {
        const items = await this.findCollectionById(id);
        const data = collections.find((i) => i._id === id);
        return { ...data, total: items?.total };
      })
    );

    return await data;
  }

  async create(payload: { key: string; name: string; singleton: boolean }) {
    const data: Collections = {
      published: false,
      fields: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...payload,
    };

    const result = await this.db.insertAsync<Collections>({
      ...data,
    });

    if (result) {
      settingsService.setSettingsOrder("collections", result._id);
    }

    return result;
  }

  async findCollectionById(
    _id: string,
    params = {
      limit: 10,
      skip: 0,
    }
  ) {
    const data = await this.db.findOneAsync<DocumentType<Collections>>({
      _id,
    });

    if (data) {
      const total = await this.collection(data.key).countAsync({});
      const orders = await settingsService.getSettingsOrder(_id);

      const items = await this.collection(data.key)
        .findAsync({})
        .sort({
          createdAt: -1,
        })
        .limit(params.limit)
        .skip(params.skip);

      return {
        ...data,
        items: orders.map((e) => items.find((i) => i._id === e)),
        total,
        limit: params.limit,
        skip: params.skip,
      };
    }
  }

  async removeCollectionById(_id: string) {
    const data = await this.db.findOneAsync<DocumentType<Collections>>({
      _id,
    });

    if (data) {
      const removed = await this.db.removeAsync(
        {
          _id: data._id,
        },
        {}
      );

      if (removed && data.key) {
        await settingsService.removeSettingsOrder("collections", data._id);
        this.removeCollection(data.key);
      }
    }
  }

  async findCollectionByKey(
    key: string,
    params: {
      limit: number;
      skip: number;
    } = {
      limit: 10,
      skip: 0,
    }
  ) {
    const data = await this.db.findOneAsync<DocumentType<Collections>>({
      key,
    });

    if (data) {
      const items = await this.collection(data.key).findAsync({});

      return {
        ...data,
        items,
      };
    }
  }

  async findCollectionByResourceId(parentId: string, resourceId: string) {
    const parent = await this.findCollectionById(parentId);

    if (parent) {
      return await this.collection(parent.key).findOneAsync({
        _id: resourceId,
      });
    }
  }

  /**
   * @deprecated
   */
  async findCollectionByResourceKey(parentKey: string, resourceKey: string) {
    const parent = await this.findCollectionByKey(parentKey);

    if (parent) {
      return await this.collection(parent.key).findOneAsync({
        key: resourceKey,
      });
    }
  }

  async createCollectionById(id: string, data: any) {
    const collection = await this.findCollectionById(id);

    if (collection?.key) {
      const resource = await this.collection(collection?.key).insertAsync({
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await settingsService.setSettingsOrder(collection._id, resource._id);

      return resource;
    }
  }

  async updateCollectionById(id: string, data: any) {
    const collection = await this.findCollectionById(id);

    if (collection) {
      return await this.db.updateAsync<Collections>(
        {
          key: collection.key,
        },
        {
          $set: {
            ...data,
            updatedAt: Date.now(),
          },
        }
      );
    }
  }

  async removeCollectionByResourceId(parentId: string, resourceId: string) {
    const collection = await this.findCollectionById(parentId);

    if (collection) {
      await settingsService.removeSettingsOrder(parentId, resourceId);

      return await this.collection(collection?.key).removeAsync(
        {
          _id: resourceId,
        },
        {}
      );
    }

    return {};
  }

  async updateCollectionByResourceId(
    parentId: string,
    resourceId: string,
    data: Partial<Collection>
  ) {
    const collection = await this.findCollectionById(parentId);

    if (collection) {
      const aliasField = collection?.options?.aliasField;
      const content: Record<string, any> = {};

      if (data.content) {
        collection.fields.forEach((field) => {
          content[field.key] = data.content?.[field.key];
        });
      }

      if (aliasField) {
        const key = data.content?.[aliasField];
        data.key = key;
      }

      data.content = content;
      data.updatedAt = Date.now();

      return await this.collection(collection?.key).updateAsync(
        {
          _id: resourceId,
        },
        {
          $set: {
            ...data,
          },
        }
      );
    }

    return {};
  }

  async insertData(id: string, body: any[]) {
    const collection = await this.findCollectionById(id);

    if (collection) {
      await this.collection(collection.key).insertAsync(body);

      return { success: true };
    }
  }
}

export const collectionService = new CollectionService();
