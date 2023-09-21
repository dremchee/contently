import { defineAsyncComponent, useContently } from "#imports";
import { FieldType } from "../../../../api/types";

const { t } = useContently();

export const PRIMITIVE_FIELDS = [
  FieldType.TEXT,
  FieldType.TEXTAREA,
  FieldType.DATE,
  FieldType.NUMBER,
  FieldType.BOOLEAN,
  FieldType.MEDIA,
];

export const fields = [
  {
    icon: "text",
    type: FieldType.TEXT,
    name: String(t("textField")),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "text-wrap",
    type: FieldType.TEXTAREA,
    name: String(t("textFieldMultiline")),
    view: defineAsyncComponent(() => import("./textarea/TextareaField.vue")),
  },
  {
    icon: "draft-line",
    type: FieldType.RICHTEXT,
    name: String(t("textEditor")),
    view: defineAsyncComponent(() => import("./richtext/RichtextField.vue")),
  },
  {
    icon: "list",
    type: FieldType.LIST,
    name: String(t("list")),
    view: defineAsyncComponent(() => import("./list/ListFieldView.vue")),
    edit: defineAsyncComponent(() => import("./list/ListFieldEdit.vue")),
  },
  {
    icon: "calendar",
    type: FieldType.DATE,
    name: String(t("date")),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "calculator",
    type: FieldType.NUMBER,
    name: String(t("number")),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "checkbox",
    type: FieldType.BOOLEAN,
    name: String(t("boolean")),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "tag",
    type: FieldType.TAG,
    name: String(t("tags")),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "file-image",
    type: FieldType.MEDIA,
    name: String(t("media")),
    view: defineAsyncComponent(() => import("./media/MediaFieldView.vue")),
    edit: defineAsyncComponent(() => import("./media/MediaFieldEdit.vue")),
  },
  {
    icon: "key",
    type: FieldType.KEY,
    name: String(t("key")),
    view: defineAsyncComponent(() => import("./key/KeyFieldView.vue")),
    edit: defineAsyncComponent(() => import("./key/KeyFieldEdit.vue")),
  },
];
