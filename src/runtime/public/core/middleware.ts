import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useContently } from "#imports";
import { RouterName } from "./const";

export default defineNuxtRouteMiddleware(async (to, _) => {
  const { isAuth, api } = useContently();

  const hasAdminUrl = String(to.name).startsWith("admin");

  if (hasAdminUrl) {
    await api.init();

    if (!isAuth.value && to.name !== RouterName.LOGIN) {
      return navigateTo({
        name: RouterName.LOGIN,
      });
    }

    if (isAuth.value && to.name == RouterName.LOGIN) {
      return navigateTo({
        name: RouterName.INDEX,
      });
    }
  }
});
