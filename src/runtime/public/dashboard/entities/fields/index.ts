import { defineAsyncComponent, useContently } from "#imports";
import { FieldType, Field } from "#runtime/api/types";
import { ZodArray, SafeParseReturnType, ZodObject, ZodString, z } from "zod";

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
    schema: z.string(),
    defaultValue: "",
    name: t("textField"),
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "text-wrap",
    type: FieldType.TEXTAREA,
    schema: z.string(),
    defaultValue: "",
    name: t("textFieldMultiline"),
    view: defineAsyncComponent(() => import("./textarea/TextareaField.vue")),
  },
  {
    icon: "draft-line",
    type: FieldType.RICHTEXT,
    schema: z.object({}),
    defaultValue: {},
    name: t("textEditor"),
    view: defineAsyncComponent(() => import("./richtext/RichtextField.vue")),
  },
  {
    icon: "list",
    type: FieldType.LIST,
    name: t("list"),
    schema: z.object({}),
    defaultValue: {},
    view: defineAsyncComponent(() => import("./list/ListFieldView.vue")),
    edit: defineAsyncComponent(() => import("./list/ListFieldEdit.vue")),
  },
  {
    icon: "calendar",
    type: FieldType.DATE,
    name: t("date"),
    schema: z.string(),
    defaultValue: "",
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "calculator",
    type: FieldType.NUMBER,
    name: t("number"),
    schema: z.string(),
    defaultValue: "",
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "checkbox",
    type: FieldType.BOOLEAN,
    name: t("boolean"),
    schema: z.boolean(),
    defaultValue: "",
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "tag",
    type: FieldType.TAG,
    name: t("tags"),
    schema: z.string(),
    defaultValue: "",
    view: defineAsyncComponent(() => import("./text/TextField.vue")),
  },
  {
    icon: "file-image",
    type: FieldType.MEDIA,
    name: t("media"),
    schema: z.string(),
    defaultValue: "",
    view: defineAsyncComponent(() => import("./media/MediaFieldView.vue")),
    edit: defineAsyncComponent(() => import("./media/MediaFieldEdit.vue")),
  },
  {
    icon: "key",
    type: FieldType.KEY,
    name: t("key"),
    view: defineAsyncComponent(() => import("./key/KeyFieldView.vue")),
    edit: defineAsyncComponent(() => import("./key/KeyFieldEdit.vue")),
  },
];

export const validateFieldsSchema = (fieldList: Field[]) => {
  return fieldList.reduce((schema, def) => {
    const field = fields.find((e) => e.type === def.type);
    let fieldSchema = field?.schema;

    if (def.options.required) {
      if (fieldSchema instanceof ZodString) {
        fieldSchema = fieldSchema.nonempty();
      }
      if (fieldSchema instanceof ZodObject) {
        fieldSchema = fieldSchema.required();
      }
    }

    return schema.setKey(def.key, fieldSchema || z.unknown());
  }, z.object({}));
};
