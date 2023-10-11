import { ref } from "#imports";
import { useEventSource } from "@vueuse/core";
import { API_BASE_URL } from "./const";

export const notice = ref<EventSource | null>(null);

export const useNotification = () => {
  const init = async () => {
    const { eventSource } = await useEventSource(
      `${API_BASE_URL}settings/notification`,
      []
    );
    notice.value = eventSource.value;
  };

  return {
    init,
    notice,
  };
};
