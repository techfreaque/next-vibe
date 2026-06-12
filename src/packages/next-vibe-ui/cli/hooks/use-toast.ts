/**
 * CLI toast stub - prints to stdout instead of rendering UI.
 * Matches the web useToast() API so widget code works unchanged.
 */

// eslint-disable-next-line no-console -- Intentional CLI output
const log = (prefix: string, title?: string, description?: string): void => {
  const parts = [prefix, title, description].filter(Boolean).join(" ");
  process.stdout.write(`${parts}\n`);
};

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastHandle {
  id: string;
  dismiss: () => void;
  update: (props: ToastProps) => void;
}

let count = 0;

export function toast(props: ToastProps): ToastHandle {
  const id = String(++count);
  const prefix = props.variant === "destructive" ? "[error]" : "[info]"; // eslint-disable-line i18next/no-literal-string
  log(prefix, props.title, props.description);
  return {
    id,
    dismiss: () => undefined,
    update: (updated) => log(prefix, updated.title, updated.description),
  };
}

export function useToast(): {
  toast: (props: ToastProps) => ToastHandle;
  dismiss: (toastId?: string) => void;
  toasts: ToastProps[];
} {
  return {
    toast,
    dismiss: () => undefined,
    toasts: [],
  };
}
