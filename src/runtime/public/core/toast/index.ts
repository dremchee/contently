import { ref } from "#imports";
import { nanoid } from "nanoid";

export type ToastProps = {
  text: string;
  type?: ToastTypes;
};

export type ToastTypes = "success" | "default" | "error" | "warning";

type ToastType = ToastProps & {
  id: string;
};

const toasts = ref<ToastType[]>([]);

export const useToast = () => {
  const hideToast = (id: string) => {
    const current = toasts.value.find((e) => e.id === id);

    if (current) {
      const index = toasts.value.indexOf(current);
      toasts.value?.splice(index, 1);
    }
  };

  const toastShow = (data: ToastProps) => {
    const toast = {
      id: nanoid(),
      type: data.type ? data.type : "default",
      ...data,
    };

    toasts.value.push(toast);

    setTimeout(() => {
      hideToast(toast.id);
    }, 2500);
  };

  return { toastShow, hideToast, toasts };
};
