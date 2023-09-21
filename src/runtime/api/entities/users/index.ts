import { RouteOptions } from "../../types";
import { userService } from "./service";
import { buildResponse, exclude } from "../../utils/helpers";
import { validateBody, validateQuery, Type } from "h3-typebox";

import {
  readBody,
  readRawBody,
  readMultipartFormData,
  setResponseHeader,
  setResponseStatus,
  getCookie,
  getSession,
  getQuery,
} from "h3";

const all: RouteOptions = {
  url: "users",
  method: "get",
  meta: {
    requireAuth: true,
  },
  async handler() {
    return buildResponse(await userService.findAll());
  },
};

const create: RouteOptions = {
  url: "users",
  method: "post",
  async handler(event) {
    const body = await validateBody(
      event,
      Type.Object({
        email: Type.String({
          minLength: 8,
        }),
        password: Type.String({
          minLength: 6,
        }),
      })
    );

    try {
      const response = await userService.creatUser(body);
      return buildResponse(response);
    } catch (error) {
      setResponseStatus(event, 400);
    }
  },
};

export { all, create };
