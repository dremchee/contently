import { config } from "../api/const";
import { LangType } from "../api/types";
import en from "./en.json";
import ru from "./ru.json";

const messages = { en, ru };
export type LangMessage = keyof typeof en;

export const translations = (key: LangType, message: LangMessage) => {
  if (message in messages[key]) {
    return messages[key][message];
  } else if (config.defaultLocale as LangType) {
    return messages[config.defaultLocale as LangType][message] || "";
  }
};
