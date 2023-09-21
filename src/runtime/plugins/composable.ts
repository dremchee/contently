import { computed, useState, useLocalStorage } from "#imports";
import { LangType } from "../api/types";
import { ContentlyApi } from "./api";
import { translations, LangMessage } from "../locales";
import { withQuery } from "ufo";

import {
  User,
  LangTypeValue,
  Collections,
  DocumentType,
  Settings,
} from "../api/types";
import { config } from "../api/const";

export const useContently = () => {
  const storage = useLocalStorage<{ sidebar: { width?: number } }>("settings", {
    sidebar: {},
  });
  const collections = useState<DocumentType<Collections>[]>("collections");
  const settings = useState<DocumentType<Settings>>("settings");
  const user = useState<DocumentType<User>>("user");

  const isReady = useState("isReady", () => false);
  const isAuth = useState("isAuth", () => false);

  const locale = useState<LangTypeValue>(
    "locale",
    () => config.defaultLocale as LangTypeValue
  );

  const t = (message: LangMessage) =>
    computed(() => translations(locale.value, message)).value;
  const locales = LangType;

  const previewUrl = (
    id: string,
    options?: { width?: number; height?: number; quality?: number }
  ) => {
    const url = withQuery(`/__api/assets/${id}`, options || {});

    return url;
  };

  const api = new ContentlyApi();

  return {
    isReady,
    isAuth,
    previewUrl,
    user,
    api,
    locale,
    locales,
    t,
    collections,
    settings,
    storage,
  };
};
