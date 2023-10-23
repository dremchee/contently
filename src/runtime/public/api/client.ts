import { useApiFetch } from "./http";

import type {
  Settings,
  User,
  DocumentType,
  Collections,
  Collection,
  File,
  Files,
  LangType,
} from "#runtime/api/types";

export class ClientApi {
  async readCollections() {
    const { data } = await useApiFetch<DocumentType<Collections>[]>(
      "collections"
    );

    return data.value;
  }

  async readCollection(
    key: string,
    options?: { limit?: number; skip?: number }
  ) {
    const { data } = await useApiFetch<DocumentType<Collections>>(
      `public/collections/${key}`,
      {
        query: options,
      }
    );

    return data.value;
  }

  async readCollectionItem(key: string, id: string) {
    const { data } = await useApiFetch<DocumentType<Collections>>(
      `public/collections/${key}/resource/${id}`
    );

    return data.value;
  }

  async readSingleCollection(key: string) {
    const { data } = await useApiFetch<DocumentType<Collection>>(
      `public/collections/${key}?type=singleton`
    );

    return data.value;
  }
}
