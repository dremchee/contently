import type { NitroAppPlugin } from "nitropack";
import { buildResponseError, verifyToken } from "../api/utils/helpers";
import { eventHandler, getCookie } from "h3";

import { routes } from "../api";

export default <NitroAppPlugin>async function (nuxtApp) {
  Object.entries(routes).forEach(([_, module]) => {
    Object.values(module).forEach(({ method, url, meta, handler }) => {
      const action = eventHandler((event) => {
        const token = getCookie(event, "token");
        const user = verifyToken(token || "");

        if (meta?.requireAuth) {
          if (user) {
            event.context.auth = user;

            return handler(event);
          }
          return buildResponseError(event, 401);
        }

        return handler(event);
      });

      nuxtApp.router.use(`/__api/${url}`, action, method);
    });
  });
};
