// src/composables/useNotify.js
import { useToast } from 'vue-toastification';

export function useNotify() {
  const toast = useToast();

  const notify = (message, type) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };

  return { notify };
}