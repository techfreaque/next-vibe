"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface ToastProviderProps {
  children: React.ReactNode;
  swipeDirection?: "up" | "down" | "left" | "right";
  swipeThreshold?: number;
  duration?: number;
  label?: string;
}

export interface ToastViewportProps {
  className?: string;
  hotkey?: string[];
  label?: string;
}

export interface ToastRootProps {
  type?: "foreground" | "background";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  duration?: number;
  variant?: "default" | "destructive";
  className?: string;
  children?: React.ReactNode;
}

export interface ToastActionProps {
  altText: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface ToastCloseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ToastTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ToastDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

// Legacy cross-platform base props interface for compatibility
export interface ToastBaseProps {
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export type ToastProps = ToastRootProps;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;

const toastVariants = cva(
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
  ...props
}: ToastViewportProps): React.JSX.Element {
  return (
    <ToastPrimitives.Viewport
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  );
}
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

export function Toast({
  className,
  variant,
  ...props
}: ToastRootProps): React.JSX.Element {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}
Toast.displayName = ToastPrimitives.Root.displayName;

export function ToastAction({
  className,
  ...props
}: ToastActionProps): React.JSX.Element {
  return (
    <ToastPrimitives.Action
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}
ToastAction.displayName = ToastPrimitives.Action.displayName;

export function ToastClose({
  className,
  ...props
}: ToastCloseProps): React.JSX.Element {
  return (
    <ToastPrimitives.Close
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className,
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  );
}
ToastClose.displayName = ToastPrimitives.Close.displayName;

export function ToastTitle({
  className,
  ...props
}: ToastTitleProps): React.JSX.Element {
  return (
    <ToastPrimitives.Title
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}
ToastTitle.displayName = ToastPrimitives.Title.displayName;

export function ToastDescription({
  className,
  ...props
}: ToastDescriptionProps): React.JSX.Element {
  return (
    <ToastPrimitives.Description
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}
ToastDescription.displayName = ToastPrimitives.Description.displayName;
