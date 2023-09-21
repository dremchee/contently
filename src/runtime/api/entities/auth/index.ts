import { RouteOptions } from "../../types";
import { userService } from "../users/service";
import {
  buildResponse,
  buildResponseError,
  compareHash,
  exclude,
  signToken,
} from "../../utils/helpers";
import { validateBody, Type } from "h3-typebox";

import { setCookie } from "h3";

const login: RouteOptions = {
  url: "login",
  method: "post",
  async handler(event) {
    const { email, password } = await validateBody(
      event,
      Type.Object({
        email: Type.String(),
        password: Type.String(),
      })
    );

    const user = await userService.findByEmail(email);

    if (user) {
      const valid = await compareHash(password, user.password);

      if (valid) {
        const payload = exclude(user, ["password"]);
        const token = signToken(payload);

        if (token) {
          setCookie(event, "token", token);
          return buildResponse({ token });
        }
      }

      return buildResponseError(event, 401);
    } else {
      return buildResponseError(event, 400);
    }
  },
};

const auth: RouteOptions = {
  url: "auth",
  method: "get",
  meta: {
    requireAuth: true,
  },
  async handler(event) {
    if (event.context.auth) {
      return buildResponse(event.context.auth);
    }
    return buildResponseError(event, 401);
  },
};

export { login, auth };
