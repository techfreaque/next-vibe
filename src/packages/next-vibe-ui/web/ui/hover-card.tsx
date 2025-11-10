"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface HoverCardRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
}

export interface HoverCardTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface HoverCardPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface HoverCardContentProps {
  className?: string;
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  disablePositioningStyle?: boolean;
  asChild?: boolean;
  forceMount?: true;
  side?: "top" | "right" | "bottom" | "left";
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | Element[] | null;
  collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  arrowPadding?: number;
  sticky?: "partial" | "always";
  hideWhenDetached?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
}

export function HoverCard({ children, ...props }: HoverCardRootProps): React.JSX.Element {
  return <HoverCardPrimitive.Root {...props}>{children}</HoverCardPrimitive.Root>;
}
HoverCard.displayName = HoverCardPrimitive.Root.displayName;

export function HoverCardTrigger({ children, asChild, ...props }: HoverCardTriggerProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </HoverCardPrimitive.Trigger>
  );
}
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

export function HoverCardPortal({ children, forceMount, container }: HoverCardPortalProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </HoverCardPrimitive.Portal>
  );
}
HoverCardPortal.displayName = "HoverCardPortal";

export function HoverCardContent({ className, align = "center", sideOffset = 4, ...props }: HoverCardContentProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
