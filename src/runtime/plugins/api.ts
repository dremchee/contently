import { defineNuxtPlugin } from "#imports";
import { useApiFetch } from "./http";
import { useContently } from "#imports";

import {
  Settings,
  User,
  DocumentType,
  Collections,
  Collection,
  File,
  Files,
  LangType,
} from "../api/types";

export class ContentlyApi {
  async init() {
    const { isAuth, user, settings, collections } = useContently();
    if (!isAuth.value) {
      const auth = await this.auth();

      if (auth?.data) {
        user.value = auth?.data;
        isAuth.value = true;
      }
    }

    if (!settings.value && !collections.value) {
      await Promise.all([this.getSettings(), this.getCollections()]);
    }
  }
  async getSettings() {
    const { data } = await useApiFetch<DocumentType<Settings>>("settings");
    if (data.value?.data) {
      useContently().settings.value = data.value?.data;

      if (data.value.data.meta.locale) {
        useContently().locale.value = data.value.data.meta.locale as LangType;
      }
    }
    return data.value;
  }

  async updateMetaSettings(body: Partial<Settings["meta"]>) {
    const { data } = await useApiFetch<Settings>("settings/meta", {
      method: "PUT",
      body,
    });

    return data.value;
  }

  // Users
  async auth() {
    const { data } = await useApiFetch<DocumentType<User>>("auth");

    // if (data.value?.data) {
    //   useContently().isAuth.value = true;
    //   useContently().user.value = data.value?.data;
    // }

    return data.value;
  }
  async getUsers() {
    const { data } = await useApiFetch("users");

    return data.value;
  }
  async loginUser(body: { email: string; password: string }) {
    const { data } = await useApiFetch<DocumentType<User>>("login", {
      method: "POST",
      body,
    });

    if (data.value?.data) {
      await this.auth();
    }
    return data.value;
  }
  // Collections
  async getCollections() {
    const { data } = await useApiFetch<DocumentType<Collections>[]>(
      "collections"
    );
    if (data.value.data) {
      useContently().collections.value = data.value.data;
    }

    return data.value;
  }

  async getCollectionById(
    id: string,
    options?: { limit?: number; skip?: number }
  ) {
    const { data } = await useApiFetch<DocumentType<Collections>>(
      `collections/${id}`,
      {
        query: options,
      }
    );

    return data.value;
  }

  async getCollectionByKey(key: string) {
    const { data } = await useApiFetch<DocumentType<Collections>>(
      `public/collections/${key}`
    );

    return data.value;
  }

  async getCollectionByKeyResource(key: string, resourceKey: string) {
    const { data } = await useApiFetch<DocumentType<Collection>>(
      `public/collections/${key}/resource/${resourceKey}`
    );

    return data.value;
  }

  async getCollectionByResourceId(parentId: string, resourceId: string) {
    const { data } = await useApiFetch<DocumentType<Collection>>(
      `collections/${parentId}/resource/${resourceId}`
    );

    return data.value;
  }

  async createCollection(body: any) {
    if (body.key) {
      const { data } = await useApiFetch<DocumentType<Collections>>(
        "collections",
        {
          method: "POST",
          body,
        }
      );

      return data.value;
    }
  }

  async createCollectionById(id: string, body: any) {
    if (body) {
      const { data } = await useApiFetch<DocumentType<Collections>>(
        `collections/${id}`,
        {
          method: "POST",
          body,
        }
      );

      return data.value;
    }
  }

  async updateCollectionById(id: string, body: any) {
    if (id && body) {
      const { data } = await useApiFetch<DocumentType<Collection>>(
        `collections/${id}`,
        {
          method: "PUT",
          body,
        }
      );

      return data.value;
    }
  }

  async removeCollectionById(id: string) {
    const { data } = await useApiFetch(`collections/${id}`, {
      method: "DELETE",
    });

    return data.value;
  }

  async updateCollectionByResourceId(
    parentId: string,
    resourceId: string,
    body: any
  ) {
    if (parentId && resourceId && body) {
      const { data } = await useApiFetch<DocumentType<Collection>>(
        `collections/${parentId}/resource/${resourceId}`,
        {
          method: "PUT",
          body,
        }
      );

      return data.value;
    }
  }

  async removeCollectionByResourceId(parentId: string, resourceId: string) {
    if (parentId && resourceId) {
      const { data } = await useApiFetch<DocumentType<Collection>>(
        `collections/${parentId}/resource/${resourceId}`,
        {
          method: "DELETE",
        }
      );

      return data.value;
    }
  }

  async insertDataByCollectionId(id: string, body: any[]) {
    const { data } = await useApiFetch(`/collections/${id}/insert`, {
      method: "POST",
      body,
    });

    return data.value;
  }

  async setOrder(key: string, id: string) {
    const body = {
      key,
      id,
    };

    await useApiFetch(`settings/order/${key}`, {
      method: "PATCH",
      body,
    });
  }

  async updateOrder(
    key: string,
    body: { id: string; from: number; to: number }
  ) {
    await useApiFetch(`settings/order/${key}`, {
      method: "PUT",
      body,
    });

    this.getCollections();
  }

  async getFiles(params?: { type?: string; limit?: number; skip?: number }) {
    return await useApiFetch<Files>("files", {
      query: params,
      key: "files",
    });
  }

  async getFile(id: string) {
    const { data } = await useApiFetch<DocumentType<File>>(`files/${id}`);

    return data.value;
  }

  async uploadFile(body: FormData) {
    const { data, error } = await useApiFetch<DocumentType<File>>(
      "files/upload",
      {
        method: "POST",
        body,
      }
    );

    if (!error.value) return data.value;
  }

  async removeFile(id: string) {
    const { data } = await useApiFetch<DocumentType<File>>(`files/${id}`, {
      method: "DELETE",
    });

    return data.value;
  }

  async previewFile(id: string) {
    const { data } = await useApiFetch<DocumentType<File>>(`preview/${id}`);

    return data.value;
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      contently: new ContentlyApi(),
    },
  };
});
