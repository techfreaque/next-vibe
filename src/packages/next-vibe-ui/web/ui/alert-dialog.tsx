"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

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

export interface AlertDialogOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDialogContentProps {
  className?: string;
  children?: React.ReactNode;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AlertDialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertDialogActionProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AlertDialogCancelProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

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
  ...props
}: AlertDialogOverlayProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export function AlertDialogContent({
  className,
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
        {...props}
      />
    </AlertDialogPortal>
  );
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export function AlertDialogHeader({
  className,
  children,
}: AlertDialogHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
    >
      {children}
    </div>
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

export function AlertDialogFooter({
  className,
  children,
}: AlertDialogFooterProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

export function AlertDialogTitle({
  className,
  ...props
}: AlertDialogTitleProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className,
      )}
      {...props}
    />
  );
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
