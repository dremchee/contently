import type { ModuleOptions } from "../../module";
import configJson from "../../config.json" assert { type: "json" };
export const config = configJson as ModuleOptions;
