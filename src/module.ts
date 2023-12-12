import {
  defineNuxtModule,
  createResolver,
  addServerPlugin,
  addPlugin,
  addLayout,
  addImports,
  addTypeTemplate,
  addRouteMiddleware,
  extendPages,
  extendRouteRules,
  installModule,
  addComponent,
} from "@nuxt/kit";

import { writeFileSync } from "node:fs";
import { ModuleOptionsEnum, LangType } from "./runtime/api/types";

export const { resolve } = createResolver(import.meta.url);
import { resolveModuleRoutes } from "./runtime/public/pages/pages";
import defu from "defu";
const moduleRoutes = resolveModuleRoutes(resolve);

type ModuleExtensions = {
  title: string;
  route: string;
  icon: string;
  component: {
    name: string;
    filePath: string;
  };
};

export interface ModuleOptions {
  databasePath: string;
  uploadsPath: string;
  secretKey: string;
  userLogin: string;
  userPassword: string;
  managerUrl?: string;
  defaultLocale?: string;
  extensions?: ModuleExtensions[];
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
    extensions: [],
  },
  async setup(moduleOptions, nuxt) {
    await installModule("@vueuse/nuxt");
    nuxt.options.alias["#runtime"] = `${resolve("./runtime")}`;

    await writeFileSync(
      resolve("./config.json"),
      JSON.stringify(moduleOptions, null, "\t")
    );

    addLayout(
      {
        src: resolve("./runtime/public/layout/DashboardLayout.vue"),
        // filename: "AdminDashboardLayout.vue",
        // write: true,
      },
      "dashboard"
    );

    addImports([
      {
        name: "useContently",
        as: "useContently",
        from: resolve("./runtime/public/core/composable"),
      },
    ]);
    addServerPlugin(resolve("./runtime/server/plugin"));

    addTypeTemplate({
      filename: "types/contently.d.ts",
      src: resolve("./runtime/contently.d.ts"),
    });

    addPlugin(resolve("./runtime/plugins/contently"));

    addRouteMiddleware({
      name: ModuleOptionsEnum.NAME,
      path: resolve("./runtime/public/core/middleware"),
      global: true,
    });

    if (moduleOptions.extensions) {
      // moduleOptions.extensions.forEach(({ component }) => {
      //   addComponent({
      //     name: component.name,
      //     filePath: resolve(nuxt.options.srcDir, component.filePath),
      //   });
      // });

      nuxt.options.runtimeConfig.public.contently = defu(
        nuxt.options.runtimeConfig.public.contently,
        {
          extensions: moduleOptions.extensions,
        }
      );
    }

    extendPages((pages) => {
      moduleOptions.extensions?.forEach((ext) => {
        const data = {
          name: `admin-extension-${ext.route}`,
          path: `/admin/${ext.route}`,
          file: resolve(nuxt.options.srcDir, ext.component.filePath),
        };

        moduleRoutes[1].children?.push(data);
      });

      moduleRoutes.forEach((route) => {
        pages.push(route);
      });
    });

    extendRouteRules("/admin/**", {
      ssr: false,
    });
  },
});
