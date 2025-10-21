/**
 * STUB: use-toast
 * Auto-generated placeholder for web-only toast hook
 *
 * This hook exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: any;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    console.warn('🔶 Using stub: useToast');
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...props };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    return {
      id,
      dismiss: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
      update: (newProps: Partial<Toast>) => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...newProps } : t))
        );
      },
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
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

export default useToast;
