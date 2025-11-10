"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform type exports
export interface TooltipProviderProps {
  children?: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

export interface TooltipRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  delayDuration?: number;
}

export interface TooltipTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface TooltipContentProps {
  className?: string;
  children?: React.ReactNode;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  alignOffset?: number;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  hidden?: boolean;
  portalHost?: string;
}

export interface TooltipPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement | null;
  forceMount?: boolean;
}

export function TooltipProvider({ children, delayDuration, skipDelayDuration, disableHoverableContent }: TooltipProviderProps): React.JSX.Element {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} disableHoverableContent={disableHoverableContent}>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip(props: TooltipRootProps): React.JSX.Element {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger(props: TooltipTriggerProps): React.JSX.Element {
  return <TooltipPrimitive.Trigger {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: TooltipContentProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}
