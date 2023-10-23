import { resolveSchema, generateTypes } from "untyped";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createResolver } from "@nuxt/kit";

export interface CreateTypeHook {
  "contently:type": (data: { name: string; data: any }) => void;
}

/**
 *
 * @param interfaceName Enter normal case
 * @param payload Data object
 * @returns
 */

export const generateType = async (interfaceName: string, payload: any) => {
  if (!interfaceName && !payload) {
    console.log("Name interface name or payload empty data");
    return;
  }
  const generatePath = createResolver(import.meta.url).resolve(
    `${interfaceName}.d.ts`
  );

  const schema = await resolveSchema(payload);

  const data = generateTypes(schema, {
    interfaceName,
    addDefaults: false,
    addExport: true,
  });

  // writeFileSync(generatePath, data, "utf-8");
};
