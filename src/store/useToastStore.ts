import { create } from 'zustand';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  createdAt: number;
}

type ToastOptions = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: ({ title, message, variant = 'info', duration = 4000 }) => {
    const id = createId();
    const toast: Toast = {
      id,
      title,
      message,
      variant,
      createdAt: Date.now(),
    };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    if (duration > 0 && typeof window !== 'undefined') {
      window.setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export const pushToast = (options: ToastOptions) => useToastStore.getState().addToast(options);
