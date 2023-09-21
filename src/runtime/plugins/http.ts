import { AsyncData, UseFetchOptions, navigateTo } from "#app";
import { useFetch } from "#imports";
import { useContently } from "./composable";
import { RouterName } from "./const";

export const useApiFetch = <T>(
  url: string,
  options?: UseFetchOptions<unknown>
) => {
  const { isAuth } = useContently();

  const http = useFetch(url, {
    ...options,
    baseURL: "/__api/",
    watch: false,
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
