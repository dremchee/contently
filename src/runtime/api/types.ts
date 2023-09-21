import type { EventHandler } from "h3";
export { StatusCodes } from "http-status-codes";

export enum ModuleOptionsEnum {
  NAME = "nuxt-contently",
  CONFIG_KEY = "contentlyOptions",
}

export enum LangType {
  EN = "en",
  RU = "ru",
}

export type LangTypeValue = `${LangType}`;

export type DocumentType<T> = T & {
  _id: string;
};

export enum MethodOptions {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

export interface BuildResponse<T> {
  data?: T;
  error: boolean;
}

export type RouteOptions = {
  url: string;
  method: `${MethodOptions}`;
  meta?: {
    requireAuth?: boolean;
  };
  handler: EventHandler;
};

// MODELS

// User entities
export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export type User = {
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

// Collections entities
export enum Status {
  PUBLISHED = "published",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export type Collections = {
  key: string;
  name: string;
  published: boolean;
  singleton: boolean;
  fields: Field[];
  items: DocumentType<Collection>[];
  options?: {
    displayField?: string;
  };
  readonly total?: number;
  readonly limit?: number;
  readonly skip?: number;
  createdAt: number;
  updatedAt: number;
};

export type Collection = {
  key: string;
  published: boolean;
  status: Status;
  content: Record<string, any>;
  createdAt: number;
  updatedAt: number;
};

// Files entities
export type File = {
  name: string;
  originName: string;
  type: string;
  size: number;
  hash: string;
  readonly path?: string;
  createdAt: number;
  updatedAt: number;
};

export type Files = {
  items: DocumentType<File>[];
  readonly total?: number;
  readonly limit?: number;
  readonly skip?: number;
};

// Settings entities
export type Settings = {
  meta: {
    title: string;
    description: string;
    favicon: string;
    locale: LangTypeValue;
  };
  orders: Record<string, string[]>;
  installed: boolean;
};

// Static entities
export enum FieldType {
  KEY = "key",
  TEXT = "text",
  TEXTAREA = "textarea",
  RICHTEXT = "richtext",
  LIST = "list",
  BOOLEAN = "boolean",
  NUMBER = "number",
  DATE = "date",
  TAG = "tag",
  MEDIA = "media",
}

export type Field<
  Data = Record<string, unknown>,
  Schema = Record<string, unknown>
> = {
  id: string;
  type: FieldType;
  key: string;
  name: string;
  description: string;
  options: {
    required: boolean;
    readonly: boolean;
    hidden: boolean;
    unique?: boolean;
    primaryKey?: boolean;
  };
  data?: Record<string, Data>;
  schema?: Schema;
};

export type FileTypes = "image" | "video" | "audio" | "application";
