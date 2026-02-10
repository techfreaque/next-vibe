"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { useTouchDevice } from "@/hooks/use-touch-device";

import type { StyleType } from "../utils/style-type";

export interface ToastProviderProps {
  children: React.ReactNode;
  swipeDirection?: "up" | "down" | "left" | "right";
  swipeThreshold?: number;
  duration?: number;
  label?: string;
}

export type ToastViewportProps = {
  hotkey?: string[];
  label?: string;
} & StyleType;

export type ToastRootProps = {
  type?: "foreground" | "background";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  duration?: number;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
} & StyleType;

export type ToastActionProps = {
  altText: string;
  children?: React.ReactNode;
  onClick?: () => void;
} & StyleType;

export type ToastCloseProps = {
  children?: React.ReactNode;
} & StyleType;

export type ToastTitleProps = {
  children?: React.ReactNode;
} & StyleType;

export type ToastDescriptionProps = {
  children?: React.ReactNode;
} & StyleType;

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function ToastProvider({
  children,
  ...props
}: ToastProviderProps): React.JSX.Element {
  return (
    <ToastPrimitives.Provider {...props}>{children}</ToastPrimitives.Provider>
  );
}
ToastProvider.displayName = ToastPrimitives.Provider.displayName;

export function ToastViewport({
  className,
  style,
  hotkey,
  label,
}: ToastViewportProps): React.JSX.Element {
  return (
    <ToastPrimitives.Viewport
      className={cn(
        "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]",
        className,
      )}
      style={style}
      hotkey={hotkey}
      label={label}
    />
  );
}
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

export function Toast({
  className,
  style,
  variant,
  type,
  open,
  onOpenChange,
  defaultOpen,
  duration,
  children,
}: ToastRootProps): React.JSX.Element {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      style={style}
      type={type}
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      duration={duration}
    >
      {children}
    </ToastPrimitives.Root>
  );
}
Toast.displayName = ToastPrimitives.Root.displayName;

export function ToastAction({
  className,
  style,
  altText,
  children,
  onClick,
}: ToastActionProps): React.JSX.Element {
  return (
    <ToastPrimitives.Action
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      style={style}
      altText={altText}
      onClick={onClick}
    >
      {children}
    </ToastPrimitives.Action>
  );
}
ToastAction.displayName = ToastPrimitives.Action.displayName;

export function ToastClose({
  className,
  style,
  children,
}: ToastCloseProps): React.JSX.Element {
  const isTouchDevice = useTouchDevice();

  return (
    <ToastPrimitives.Close
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        isTouchDevice ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className,
      )}
      style={style}
      toast-close=""
    >
      {children ?? <X className="h-4 w-4" />}
    </ToastPrimitives.Close>
  );
}
ToastClose.displayName = ToastPrimitives.Close.displayName;

export function ToastTitle({
  className,
  style,
  children,
}: ToastTitleProps): React.JSX.Element {
  return (
    <ToastPrimitives.Title
      className={cn("text-sm font-semibold", className)}
      style={style}
    >
      {children}
    </ToastPrimitives.Title>
  );
}
ToastTitle.displayName = ToastPrimitives.Title.displayName;

export function ToastDescription({
  className,
  style,
  children,
}: ToastDescriptionProps): React.JSX.Element {
  return (
    <ToastPrimitives.Description
      className={cn("text-sm opacity-90", className)}
      style={style}
    >
      {children}
    </ToastPrimitives.Description>
  );
}
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Export type for ToastAction element for use in hooks
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
