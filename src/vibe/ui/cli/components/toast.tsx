import * as React from "react";

export type {
  ToastActionElement,
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastRootProps,
  ToastTitleProps,
  ToastViewportProps,
} from "../../web/components/toast";

import { cva } from "class-variance-authority";

export const toastVariants = cva("");

import type {
  ToastActionProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastRootProps,
  ToastTitleProps,
} from "../../web/components/toast";

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
