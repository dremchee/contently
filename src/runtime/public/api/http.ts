import { navigateTo, useNuxtApp } from "#app";
import type { AsyncData, UseFetchOptions } from "#app";
import { useFetch } from "#imports";
import { useContently } from "../core/composable";
import { RouterName, API_BASE_URL } from "../core/const";

export const useApiFetch = <T>(
  url: string,
  options?: UseFetchOptions<unknown>
) => {
  const { isAuth } = useContently();
  // const app = useNuxtApp();

  const http = useFetch(url, {
    ...options,
    baseURL: API_BASE_URL,
    watch: false,
    // getCachedData(key) {
    //   return app.payload.data[key] || app.static.data[key];
    // },
    onResponseError(ctx) {
      if (ctx.response.status === 401) {
        isAuth.value = false;
        navigateTo({
          name: RouterName.LOGIN,
        });
      }
    },
  });

  return http as AsyncData<{ data: T }, Error>;
};
