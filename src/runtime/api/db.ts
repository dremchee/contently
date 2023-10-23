import Datastore from "@seald-io/nedb";
import { resolve } from "path";
import { config } from "./const";
import type { ModuleOptions } from "../../module";

export class Database {
  readonly storage: Datastore;
  readonly config: ModuleOptions;

  constructor(name: string) {
    this.config = config;

    const filename = resolve(
      process.cwd(),
      this.config.databasePath,
      `${name}.db`
    );

    this.storage = new Datastore({
      filename,
      autoload: true,
    });
  }

  private static instance: Record<string, Database> = {};

  static getInstance(name: string) {
    if (!(name in Database.instance)) {
      Database.instance[name] = new Database(name);
    }
    return Database.instance[name].storage;
  }

  static removeInstance(name: string) {
    if (name in Database.instance) {
      delete Database.instance[name];
    }
  }
}

export { Datastore };
