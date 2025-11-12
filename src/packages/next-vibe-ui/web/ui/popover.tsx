"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface PopoverRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  modal?: boolean;
}

export interface PopoverTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PopoverAnchorProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PopoverPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface PopoverContentProps {
  className?: string;
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  onInteractOutside?: (event: Event) => void;
  forceMount?: true;
  id?: string;
}

export interface PopoverCloseProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export function Popover({
  children,
  ...props
}: PopoverRootProps): React.JSX.Element {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
}
Popover.displayName = PopoverPrimitive.Root.displayName;

export function PopoverTrigger({
  children,
  asChild,
  ...props
}: PopoverTriggerProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
}
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export function PopoverAnchor({
  children,
  asChild,
  ...props
}: PopoverAnchorProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Anchor asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Anchor>
  );
}
PopoverAnchor.displayName = PopoverPrimitive.Anchor.displayName;

export function PopoverPortal({
  children,
  forceMount,
  container,
}: PopoverPortalProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </PopoverPrimitive.Portal>
  );
}
PopoverPortal.displayName = PopoverPrimitive.Portal.displayName;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[9999] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export function PopoverClose({
  children,
  asChild,
  ...props
}: PopoverCloseProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Close asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Close>
  );
}
PopoverClose.displayName = PopoverPrimitive.Close.displayName;
