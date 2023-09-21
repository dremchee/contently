import { LangType } from "../api/types";

export const PUBLIC_BASE_URL = "admin";
export const API_BASE_URL = "__admin";

export enum RouterName {
  HOME = "admin",
  INDEX = "admin-index",
  LOGIN = "admin-login",
  COLLECTIONS = "admin-collections",
  COLLECTIONS_ITEMS = "admin-collections-items",
  COLLECTIONS_ADD = "admin-collections-add",
  COLLECTIONS_EDIT = "admin-collections-edit",
  COLLECTIONS_ID = "admin-collections-id",
  CONTENT = "admin-content",
  CONTENT_ID = "admin-content-id",
  CONTENT_ITEMS = "admin-content-items",
  CONTENT_ADD = "admin-content-add",
  CONTENT_EDIT = "admin-content-edit",
  SETTINGS = "admin-settings",
  FILES = "admin-files",
  PROJECT = "admin-project",
}

export const LANGUAGES = Object.entries(LangType);
