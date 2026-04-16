import * as React from "react";

export type {
  ToastProviderProps,
  ToastViewportProps,
  ToastRootProps,
  ToastActionProps,
  ToastCloseProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionElement,
} from "../../web/ui/toast";

import { cva } from "class-variance-authority";

export const toastVariants = cva("");

import type {
  ToastProviderProps,
  ToastRootProps,
  ToastActionProps,
  ToastTitleProps,
  ToastDescriptionProps,
} from "../../web/ui/toast";

export function ToastProvider({
  children,
}: ToastProviderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ToastViewport(): null {
  return null;
}

export function Toast({ children }: ToastRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ToastAction({
  children,
}: ToastActionProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ToastClose(): null {
  return null;
}

export function ToastTitle({
  children,
}: ToastTitleProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ToastDescription({
  children,
}: ToastDescriptionProps): React.JSX.Element | null {
  return <>{children}</>;
}
