import { H3Event, getCookie } from "h3";
import { createHooks } from "hookable";
import { nanoid } from "nanoid";

export enum SSEMethodName {
  UPDATE_META = "updateMeta",
  TEST = "TEST",
}

export type SSENoticeData = {
  type: string;
  message: string;
};

export enum SSEEventName {
  NOTICE = "sse:notice",
  EVENT = "sse:event",
}

export type SSEEventPayload = {
  key: SSEEventName;
  payload: SSEEventData;
};

export type SSEEventData<Data = unknown> = {
  method: SSEMethodName;
  data: Data;
};

export interface SSEHooks {
  [SSEEventName.NOTICE]: (data: SSEEventPayload) => void;
  [SSEEventName.EVENT]: (data: any) => void;
}

export const sseHooks = createHooks<SSEHooks>();

// Invoke hook event in method
export const sseHookEvent = async (event: H3Event, name: SSEEventName) => {
  if (name === SSEEventName.NOTICE) {
    const key = await getCookie(event, "ssid");

    sseHooks.hook(name, (payload) => {
      if (payload.key === key) {
        sendSourceEvent(event, name, payload);
      }
    });
  }
};

// Send hook event
export const sseHookHandler = async (
  event: H3Event,
  name: SSEEventName,
  payload: SSEEventData
) => {
  const key = await getCookie(event, "ssid");
  return sseHooks.callHook(name, { key, payload });
};

// Send headers for event stream
export const sendSourceEvent = async (
  event: H3Event,
  name: string,
  payload: SSEEventPayload
) => {
  const id = `id: ${JSON.stringify(nanoid())}\n`;
  const nameEvent = `event: ${name}\n`;
  const data = `data: ${JSON.stringify(payload.payload)}\n\n`;

  return [id, nameEvent, data].forEach((e) => event.node.res.write(e));
};
