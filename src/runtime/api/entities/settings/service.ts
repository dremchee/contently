import { userService } from "../users/service";
import { config } from "../../const";
import type { DocumentType, LangType, Settings } from "../../types";
import { ApiService } from "../../api";
import { arrayMoveIndex } from "../../utils/helpers";

class SettingsService extends ApiService {
  constructor() {
    super("settings");
  }

  async init() {
    const count = await this.db.findOneAsync({});
    const data: Settings = {
      meta: {
        title: "Customer site",
        description: "Customer site description",
        favicon: "",
        locale: config.defaultLocale as LangType,
      },
      orders: {},
      installed: true,
    };

    if (!count) {
      const user = {
        email: config.userLogin,
        password: config.userPassword,
      };

      const findUser = await userService.findByEmail(user.email);

      if (!findUser) {
        await userService.creatUserAdmin(user);
      }

      return await this.db.insertAsync<Settings>(data);
    } else {
      return await this.db.findOneAsync<Settings>({});
    }
  }

  async findAll() {
    return await this.db.findOneAsync<Settings>({});
  }

  async updateSettingsMeta(data: Partial<Settings["meta"]>) {
    const { _id, meta } = await this.db.findOneAsync<DocumentType<Settings>>(
      {}
    );
    return await this.db.updateAsync<Settings>(
      {
        _id,
      },
      {
        $set: {
          meta: {
            ...meta,
            ...data,
          },
        },
      }
    );
  }

  async getSettingsOrder(id: string) {
    const settings = await this.db.findOneAsync<DocumentType<Settings>>({});

    return settings?.orders[id] ?? [];
  }

  async setSettingsOrder(key: string, id: string) {
    const { orders } = await this.db.findOneAsync<DocumentType<Settings>>({});

    if (orders?.[key]?.length) {
      orders[key].unshift(id);
    } else {
      orders[key] = [id];
    }

    return await this.db.updateAsync<Settings>(
      {},
      {
        $set: {
          [`orders.${key}`]: orders[key],
        },
      }
    );
  }

  async removeSettingsOrder(key: string, id: string) {
    const { _id, orders } = await this.db.findOneAsync<DocumentType<Settings>>(
      {}
    );

    const unset = () => {
      if (orders?.[id]) {
        return { [`orders.${id}`]: 1 };
      }
      return {};
    };

    return await this.db.updateAsync<Settings>(
      {
        _id,
      },
      {
        $unset: unset(),
        $pull: {
          [`orders.${key}`]: id,
        },
      }
    );
  }

  async updateSettingsOrder(
    id: string,
    data: { id: string; from: number; to: number }
  ) {
    const { _id, orders } = await this.db.findOneAsync<DocumentType<Settings>>(
      {}
    );

    const update = await this.db.updateAsync<Settings>(
      {
        _id,
      },
      {
        $set: {
          [`orders.${id}`]: arrayMoveIndex(orders[id], data.from, data.to),
        },
      }
    );

    this.compactDatafile();

    return update;
  }
}

export const settingsService = new SettingsService();
