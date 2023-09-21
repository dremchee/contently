import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { setResponseStatus, H3Event, createError } from "h3";
import { getReasonPhrase } from "http-status-codes";
import jwt from "jsonwebtoken";
import { config } from "../const";

export function exclude<T, Key extends keyof T>(
  obj: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

const KEY_LENGTH = 32;

export const createHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");

    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}.${derivedKey.toString("hex")}`);
    });
  });
};

export const compareHash = (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, hashKey] = hash.split(".");
    const hashKeyBuff = Buffer.from(hashKey, "hex");
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(timingSafeEqual(hashKeyBuff, derivedKey));
    });
  });
};

export const signToken = (data: any, expiresIn: string | number = "7d") => {
  try {
    const token = jwt.sign(data, config.secretKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    return;
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.secretKey);
  } catch (error) {
    return;
  }
};

export const buildResponse = (data: any) => {
  return {
    data,
    error: false,
  };
};

export const arrayMoveIndex = (
  arr: string[],
  fromIndex: number,
  toIndex: number
) => {
  const el = arr[fromIndex];
  arr.splice(fromIndex, 1);
  return arr.toSpliced(toIndex, 0, el);
};

export const buildResponseError = (
  event: H3Event,
  status: number,
  message?: string
) => {
  setResponseStatus(event, status);
  const error = createError({
    status,
    message: message || getReasonPhrase(status),
  });
  return {
    error,
  };
};
