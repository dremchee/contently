import type { NuxtPage } from "@nuxt/schema";
import { PUBLIC_BASE_URL, RouterName } from "../core/const";
import type { Resolver } from "@nuxt/kit";
// const { resolve } = createResolver(import.meta.url);

export const resolveModuleRoutes = (resolve: Resolver["resolve"]) => {
  return [
    {
      name: RouterName.LOGIN,
      path: `/${PUBLIC_BASE_URL}/login`,
      file: resolve("./runtime/public/pages/LoginPage.vue"),
    },
    {
      name: RouterName.INDEX,
      path: `/${PUBLIC_BASE_URL}`,
      file: resolve("./runtime/public/pages/IndexPage.vue"),
      redirect: {
        name: RouterName.CONTENT,
      },
      children: [
        {
          name: RouterName.CONTENT,
          path: "content",
          file: resolve("./runtime/public/pages/content/ContentPage.vue"),
          children: [
            {
              name: RouterName.CONTENT_ID,
              path: ":id",
              file: resolve("./runtime/public/pages/content/ContentPageId.vue"),
              children: [
                {
                  name: RouterName.CONTENT_ITEMS,
                  path: "",
                  file: resolve(
                    "./runtime/public/pages/content/ContentPageIdItems.vue"
                  ),
                },
                {
                  name: RouterName.CONTENT_ADD,
                  path: "add",
                  file: resolve(
                    "./runtime/public/pages/content/ContentPageIdAdd.vue"
                  ),
                },
                {
                  name: RouterName.CONTENT_EDIT,
                  path: ":resource",
                  file: resolve(
                    "./runtime/public/pages/content/ContentPageIdEdit.vue"
                  ),
                },
              ],
            },
          ],
        },
        {
          name: RouterName.FILES,
          path: "files",
          file: resolve("./runtime/public/pages/files/FilesPage.vue"),
        },
        {
          name: RouterName.SETTINGS,
          path: "settings",
          file: resolve("./runtime/public/pages/settings/SettingsPage.vue"),
          redirect: {
            name: RouterName.COLLECTIONS,
          },
          children: [
            {
              name: RouterName.COLLECTIONS,
              path: "collections",
              file: resolve(
                "./runtime/public/pages/collections/CollectionsPage.vue"
              ),
              redirect: {
                name: RouterName.COLLECTIONS_ITEMS,
              },
              children: [
                {
                  name: RouterName.COLLECTIONS_ITEMS,
                  path: "",
                  file: resolve(
                    "./runtime/public/pages/collections/CollectionsPageItems.vue"
                  ),
                },
                {
                  name: RouterName.COLLECTIONS_ID,
                  path: ":id",
                  file: resolve(
                    "./runtime/public/pages/collections/CollectionsPageId.vue"
                  ),
                },
              ],
            },
            {
              name: RouterName.PROJECT,
              path: "project",
              file: resolve("./runtime/public/pages/project/ProjectPage.vue"),
            },
          ],
        },
      ],
    },
  ] as NuxtPage[];
};
