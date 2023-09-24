import { NuxtPage } from "@nuxt/schema";

import {
  defineNuxtModule,
  createResolver,
  addServerPlugin,
  addServerHandler,
  addPlugin,
  addLayout,
  addImports,
  addTypeTemplate,
  addRouteMiddleware,
  extendPages,
  extendRouteRules,
  installModule,
} from "@nuxt/kit";

import { writeFileSync } from "node:fs";
import { ModuleOptionsEnum, LangType } from "./runtime/api/types";
import { RouterName, API_BASE_URL } from "./runtime/plugins/const";

export const { resolve } = createResolver(import.meta.url);

const routes: NuxtPage[] = [
  {
    name: RouterName.LOGIN,
    path: `/${API_BASE_URL}/login`,
    file: resolve("./runtime/public/pages/LoginPage.vue"),
  },
  {
    name: RouterName.INDEX,
    path: `/${API_BASE_URL}`,
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
];

export interface ModuleOptions {
  databasePath: string;
  uploadsPath: string;
  secretKey: string;
  userLogin: string;
  userPassword: string;
  managerUrl?: string;
  defaultLocale?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: ModuleOptionsEnum.NAME,
    configKey: ModuleOptionsEnum.CONFIG_KEY,
  },
  defaults: {
    databasePath: ".data",
    uploadsPath: ".uploads",
    secretKey: "",
    userLogin: "",
    userPassword: "",
    managerUrl: "admin",
    defaultLocale: LangType.EN,
  },
  async setup(moduleOptions, nuxt) {
    await installModule("@vueuse/nuxt");
    nuxt.options.alias["#contently"] = `${resolve("./runtime")}`;

    await writeFileSync(
      resolve("./config.json"),
      JSON.stringify(moduleOptions, null, "\t")
    );

    addLayout(
      {
        src: resolve("./runtime/public/layout/DashboardLayout.vue"),
        filename: "AdminDashboardLayout.vue",
        write: true,
      },
      "dashboard"
    );

    addImports([
      {
        name: "useContently",
        as: "useContently",
        from: resolve("./runtime/plugins/composable"),
      },
    ]);
    addServerPlugin(resolve("./runtime/server/plugin"));

    addTypeTemplate({
      filename: "types/contently.d.ts",
      src: resolve("./runtime/contently.d.ts"),
    });

    addPlugin(resolve("./runtime/plugins/api"));

    addServerHandler({
      route: "/__api/**/*",
      handler: resolve("./runtime/server/handler"),
    });

    addRouteMiddleware({
      name: ModuleOptionsEnum.NAME,
      path: resolve("./runtime/plugins/middleware"),
      global: true,
    });

    extendPages((pages) => {
      routes.forEach((route) => {
        pages.push(route);
      });
    });

    extendRouteRules("/admin/**", {
      ssr: false,
    });
  },
});
