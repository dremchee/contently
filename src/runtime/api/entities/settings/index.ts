import { RouteOptions, Settings } from "../../types";
import { settingsService } from "./service";
import { buildResponse, exclude } from "../../utils/helpers";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateBody, Type } from "h3-typebox";
import { readBody, getRouterParam } from "h3";

const init: RouteOptions = {
  url: "settings",
  method: "get",
  async handler() {
    return buildResponse(await settingsService.init());
  },
};

const updateMeta: RouteOptions = {
  url: "settings/meta",
  method: "put",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const body = (await readBody(event)) as Partial<Settings["meta"]>;

    return buildResponse(await settingsService.updateSettingsMeta(body));
  },
};

const updateOrder: RouteOptions = {
  url: "settings/order/:id",
  method: "put",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const id = (await getRouterParam(event, "id")) as string;
    const body = (await readBody(event)) as any;

    return buildResponse(await settingsService.updateSettingsOrder(id, body));
  },
};

export { init, updateMeta, updateOrder };
