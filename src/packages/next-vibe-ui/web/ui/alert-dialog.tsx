"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

import { buttonVariants } from "./button";

// Cross-platform type exports
export interface AlertDialogRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AlertDialogTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface AlertDialogPortalProps {
  children: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export type AlertDialogOverlayProps = {
  children?: React.ReactNode;
} & StyleType;

export type AlertDialogContentProps = {
  children?: React.ReactNode;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onClick?: () => void;
  stopPropagation?: boolean;
} & StyleType;

export type AlertDialogHeaderProps = {
  children?: React.ReactNode;
} & StyleType;

export type AlertDialogFooterProps = {
  children?: React.ReactNode;
} & StyleType;

export type AlertDialogTitleProps = {
  children?: React.ReactNode;
} & StyleType;

export type AlertDialogDescriptionProps = {
  children?: React.ReactNode;
} & StyleType;

export type AlertDialogActionProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  stopPropagation?: boolean;
} & StyleType;

export type AlertDialogCancelProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  stopPropagation?: boolean;
  onClick?: () => void;
} & StyleType;

export function AlertDialog({
  children,
  ...props
}: AlertDialogRootProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
  );
}
AlertDialog.displayName = AlertDialogPrimitive.Root.displayName;

export function AlertDialogTrigger({
  children,
  asChild,
  ...props
}: AlertDialogTriggerProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </AlertDialogPrimitive.Trigger>
  );
}
AlertDialogTrigger.displayName = AlertDialogPrimitive.Trigger.displayName;

export function AlertDialogPortal({
  children,
  forceMount,
  container,
}: AlertDialogPortalProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </AlertDialogPrimitive.Portal>
  );
}
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

export function AlertDialogOverlay({
  className,
  style,
  ...props
}: AlertDialogOverlayProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export function AlertDialogContent({
  className,
  style,
  ...props
}: AlertDialogContentProps): React.JSX.Element {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className,
        )}
        style={style}
        {...props}
      />
    </AlertDialogPortal>
  );
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export function AlertDialogHeader({
  className,
  style,
  children,
}: AlertDialogHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

export function AlertDialogFooter({
  className,
  style,
  children,
}: AlertDialogFooterProps): React.JSX.Element {
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
AlertDialogFooter.displayName = "AlertDialogFooter";

export function AlertDialogTitle({
  className,
  style,
  ...props
}: AlertDialogTitleProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      style={style}
      {...props}
    />
  );
}
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export function AlertDialogDescription({
  className,
  style,
  ...props
}: AlertDialogDescriptionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      style={style}
      {...props}
    />
  );
}
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export function AlertDialogAction({
  className,
  style,
  ...props
}: AlertDialogActionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      style={style}
      {...props}
    />
  );
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export function AlertDialogCancel({
  className,
  style,
  ...props
}: AlertDialogCancelProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
