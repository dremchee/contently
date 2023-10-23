import type { RouteOptions, Settings } from "../../types";
import { settingsService } from "./service";
import { buildResponse, buildResponseError } from "../../utils/helpers";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateBody, Type } from "h3-typebox";
import {
  readBody,
  getRouterParam,
  setResponseHeaders,
  setResponseStatus,
  setHeaders,
  getSession,
  getQuery,
  getCookie,
} from "h3";

import {
  sseHooks,
  sendSourceEvent,
  sseHookEvent,
  SSEEventName,
  sseHookHandler,
  SSEMethodName,
} from "../../../server/hooks";

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
    const body = await readBody<Partial<Settings["meta"]>>(event);
    const data = await settingsService.updateSettingsMeta(body);

    if (data) {
      sseHookHandler(event, SSEEventName.NOTICE, {
        method: SSEMethodName.UPDATE_META,
        data,
      });
    }

    return buildResponse(data);
  },
};

const updateOrder: RouteOptions = {
  url: "settings/order/:id",
  method: "put",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    const id = await getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return buildResponseError(event, 403);
    }

    return buildResponse(await settingsService.updateSettingsOrder(id, body));
  },
};

const notification: RouteOptions = {
  url: "settings/notification",
  method: "get",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    if (!process.dev) return { disabled: true };

    setResponseHeaders(event, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    setResponseStatus(event, 200);
    sseHookEvent(event, SSEEventName.NOTICE);

    event._handled = true;
  },
};

export { init, updateMeta, updateOrder, notification };
