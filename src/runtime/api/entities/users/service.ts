import { createHash } from "../../utils/helpers";
import { User, Role } from "../../types";
import { ApiService } from "../../api";

class UserService extends ApiService {
  constructor() {
    super("users");
    this.db.ensureIndex({ fieldName: "email", unique: true });
  }

  async findAll() {
    return await this.db.findAsync<User>({}).projection({
      password: -1,
    });
  }

  async creatUser(params: { email: string; password: string }) {
    const data = {
      ...params,
      password: await createHash(params.password),
      role: Role.USER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return await this.db.insertAsync(data);
  }

  async creatUserAdmin(params: { email: string; password: string }) {
    const data = {
      ...params,
      password: await createHash(params.password),
      role: Role.ADMIN,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return await this.db.insertAsync(data);
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .findAsync<User>({
        email,
      })
      .projection({
        password: 1,
      });

    return user;
  }
}

export const userService = new UserService();
