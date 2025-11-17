"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

import { useTranslation } from "@/i18n/core/client";

// Cross-platform type exports
export interface DialogRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface DialogTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DialogPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface DialogCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export type DialogOverlayProps = {
  children?: React.ReactNode;
} & StyleType;

export type DialogContentProps = {
  children?: React.ReactNode;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: Event) => void;
  onPointerDownOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
} & StyleType;

export type DialogHeaderProps = {
  children?: React.ReactNode;
} & StyleType;

export type DialogFooterProps = {
  children?: React.ReactNode;
} & StyleType;

export type DialogTitleProps = {
  children?: React.ReactNode;
} & StyleType;

export type DialogDescriptionProps = {
  children?: React.ReactNode;
} & StyleType;

export function Dialog({
  children,
  ...props
}: DialogRootProps): React.JSX.Element {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}
Dialog.displayName = DialogPrimitive.Root.displayName;

export function DialogTrigger({
  children,
  asChild,
  ...props
}: DialogTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

export function DialogPortal({
  children,
  forceMount,
  container,
}: DialogPortalProps): React.JSX.Element {
  return (
    <DialogPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </DialogPrimitive.Portal>
  );
}
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

export function DialogClose({
  children,
  asChild,
  ...props
}: DialogCloseProps): React.JSX.Element {
  return (
    <DialogPrimitive.Close asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}
DialogClose.displayName = DialogPrimitive.Close.displayName;

export function DialogOverlay({
  className,
  style,
  ...props
}: DialogOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export function DialogContent({
  className,
  style,
  children,
  ...props
}: DialogContentProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">
            {t("app.common.accessibility.srOnly.close")}
          </span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  style,
  children,
}: DialogHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
DialogHeader.displayName = "DialogHeader";

export function DialogFooter({
  className,
  style,
  children,
}: DialogFooterProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
DialogFooter.displayName = "DialogFooter";

export function DialogTitle({
  className,
  style,
  ...props
}: DialogTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export function DialogDescription({
  className,
  style,
  ...props
}: DialogDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      style={style}
      {...props}
    />
  );
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;
