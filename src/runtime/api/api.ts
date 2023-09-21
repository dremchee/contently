import { Database, Datastore } from "./db";
import { config } from "./const";
import { ModuleOptions } from "../../module";

export class ApiService {
  name: string;
  readonly db: Datastore;
  readonly config: ModuleOptions;

  constructor(name: string) {
    this.name = name;
    this.db = Database.getInstance(this.name);
    this.config = config;
  }

  collection(name: string) {
    return Database.getInstance(`${this.name}/${name}`);
  }

  compactDatafile() {
    this.db.compactDatafileAsync();
  }

  compactDatafileCollection(name: string) {
    this.collection(name).compactDatafileAsync();
  }

  removeCollection(name: string) {
    this.collection(name).dropDatabaseAsync();
    Database.removeInstance(`${this.name}/${name}`);
  }
}
