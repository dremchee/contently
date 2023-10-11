import { ClientApi } from "#runtime/public/api/client";
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      contently: new ClientApi(),
    },
  };
});
