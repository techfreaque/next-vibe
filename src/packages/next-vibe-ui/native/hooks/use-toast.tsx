/**
 * React Native implementation of useToast hook
 *
 * Provides a simple toast notification system for React Native.
 * For more advanced toast functionality, consider using react-native-toast-message
 * or react-native-paper's Snackbar component.
 */
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  variant?: "default" | "destructive";
}

export function useToast(): {
  toast: (props: Omit<Toast, "id">) => {
    id: string;
    dismiss: () => void;
    update: (newProps: Partial<Toast>) => void;
  };
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
} {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast = { id, ...props };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    return {
      id,
      dismiss: (): void => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
      update: (newProps: Partial<Toast>): void => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...newProps } : t)));
      },
    };
  }, []);

  const dismiss = useCallback((toastId?: string): void => {
    if (toastId) {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}
