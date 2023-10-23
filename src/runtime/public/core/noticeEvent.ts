import { SSEEventName } from "#runtime/server/hooks";
import { notice } from "./notification";

export const noticeEvent = (callback: () => void) =>
  notice.value?.addEventListener(SSEEventName.NOTICE, (e) => {
    // const data = JSON.parse(e.data);
    // toastShow(data, callback);
  });
