// import { createResolver } from "@nuxt/kit";
import { NuxtPage } from "@nuxt/schema";
import { resolve } from "node:path";

// export const { resolve } = createResolver(import.meta.url);
const resolveModulePath = (path: string) => {
  return resolve(process.cwd(), "src", path);
};

resolveModulePath("./runtime/public/pages/LoginPage.vue");

export const routes: NuxtPage[] = [
  {
    name: "admin-login",
    path: "/admin/login",
    file: resolveModulePath("./runtime/public/pages/LoginPage.vue"),
  },
  {
    name: "admin",
    path: "/admin",
    file: resolveModulePath("./runtime/public/pages/IndexPage.vue"),
    children: [
      {
        name: "admin-index",
        path: "",
        meta: {
          parent: "index",
        },
        file: resolveModulePath("./runtime/public/pages/MainPage.vue"),
      },
      {
        name: "admin-collection",
        meta: {
          parent: "collections",
        },
        path: "collections",
        file: resolveModulePath(
          "./runtime/public/pages/collections/CollectionsPage.vue"
        ),
      },
      {
        name: "admin-collection-add",
        meta: {
          parent: "collections",
        },
        path: "collections/add",
        file: resolveModulePath(
          "./runtime/public/pages/collections/CollectionsPageAdd.vue"
        ),
      },
      {
        name: "admin-collection-id",
        meta: {
          parent: "collections",
        },
        path: "collections/:id",
        file: resolveModulePath(
          "./runtime/public/pages/collections/CollectionsPageId.vue"
        ),
      },
    ],
  },
];
