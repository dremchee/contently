import { H3Event, getCookie } from "h3";
import { createHooks } from "hookable";
import { nanoid } from "nanoid";

export type SSENoticeData = {
  type: string;
  message: string;
  /**
   * @description SSID key from cookie for personal session notice
   */
  key?: string;
};

export interface SSEHooks {
  "sse:event": (data: any) => any | void;
  "sse:notice": (data: SSENoticeData) => void;
}

export const sseHooks = createHooks<SSEHooks>();

export const sendSourceEvent = async (
  event: H3Event,
  name: string,
  payload: SSENoticeData
) => {
  const ssid = await getCookie(event, "ssid");

  const id = `id: ${JSON.stringify(nanoid())}\n`;
  const nameEvent = `event: ${name}\n`;
  const data = `data: ${JSON.stringify(payload)}\n\n`;

  if (payload.key && payload.key === ssid) {
    return [id, nameEvent, data].forEach((e) => event.node.res.write(e));
  }
};
