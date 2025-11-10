"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "next-vibe-ui/ui/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { useTranslation } from "@/i18n/core/client";

// Cross-platform types
export interface SheetRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface SheetTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SheetCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SheetPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface SheetOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SheetDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export interface SheetContentProps extends VariantProps<typeof sheetVariants> {
  className?: string;
  children?: React.ReactNode;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
  style?: React.CSSProperties;
  "data-sidebar"?: string;
  "data-mobile"?: string;
  portalHost?: string;
}

export function Sheet({ children, ...props }: SheetRootProps): React.JSX.Element {
  return <SheetPrimitive.Root {...props}>{children}</SheetPrimitive.Root>;
}
Sheet.displayName = SheetPrimitive.Root.displayName;

export function SheetTrigger({ children, asChild, ...props }: SheetTriggerProps): React.JSX.Element {
  return (
    <SheetPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </SheetPrimitive.Trigger>
  );
}
SheetTrigger.displayName = SheetPrimitive.Trigger.displayName;

export function SheetClose({ children, asChild, ...props }: SheetCloseProps): React.JSX.Element {
  return (
    <SheetPrimitive.Close asChild={asChild} {...props}>
      {children}
    </SheetPrimitive.Close>
  );
}
SheetClose.displayName = SheetPrimitive.Close.displayName;

export function SheetPortal({ children, forceMount, container }: SheetPortalProps): React.JSX.Element {
  return (
    <SheetPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </SheetPrimitive.Portal>
  );
}
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

export function SheetOverlay({ className, ...props }: SheetOverlayProps): React.JSX.Element {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

export function SheetContent({ side = "right", className, children, ...props }: SheetContentProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">
            {t("app.common.accessibility.srOnly.close")}
          </span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
SheetContent.displayName = SheetPrimitive.Content.displayName;

export function SheetHeader({ className, children, ...props }: SheetHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
SheetHeader.displayName = "SheetHeader";

export function SheetFooter({ className, children, ...props }: SheetFooterProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
SheetFooter.displayName = "SheetFooter";

export function SheetTitle({ className, children, ...props }: SheetTitleProps): React.JSX.Element {
  return (
    <SheetPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Title>
  );
}
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export function SheetDescription({ className, children, ...props }: SheetDescriptionProps): React.JSX.Element {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Description>
  );
}
SheetDescription.displayName = SheetPrimitive.Description.displayName;
