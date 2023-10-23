import { ref } from "#imports";
import { useEventSource } from "@vueuse/core";
import { API_BASE_URL } from "./const";
import type { SSEEventData } from "#runtime/server/hooks";
import { SSEEventName, SSEMethodName } from "#runtime/server/hooks";

export const notice = ref<EventSource | null>(null);

export const useNotification = () => {
  const init = async () => {
    const { eventSource } = await useEventSource(
      `${API_BASE_URL}settings/notification`,
      []
    );
    notice.value = eventSource.value;
  };

  const noticeEvent = (() => {
    function messageEvent(
      name: SSEMethodName,
      callback: (payload: unknown) => void,
      event: MessageEvent
    ) {
      const data = JSON.parse(event.data) as SSEEventData;
      if (
        data.method === name &&
        Object.values(SSEMethodName).includes(data.method)
      ) {
        if (callback instanceof Function) {
          callback(data.data);
        }
      }
    }

    let handler: any;

    function dispatch(
      name: SSEMethodName,
      callback: (payload: unknown) => void
    ) {
      handler = messageEvent.bind(null, name, callback);
      return notice.value?.addEventListener(SSEEventName.NOTICE, handler);
    }

    function destroy() {
      return notice.value?.removeEventListener(SSEEventName.NOTICE, handler);
    }

    return {
      dispatch,
      destroy,
    };
  })();

  return {
    init,
    notice,
    noticeEvent,
  };
};
