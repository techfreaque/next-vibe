"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Cross-platform props interfaces
export type ScrollAreaRootProps = {
  children: React.ReactNode;
} & StyleType;

export type ScrollAreaViewportProps = {
  children: React.ReactNode;
} & StyleType;

export type ScrollAreaBarProps = {
  orientation?: "vertical" | "horizontal";
} & StyleType;

export type ScrollAreaThumbProps = StyleType;

export type ScrollAreaCornerProps = StyleType;

// Legacy alias for backwards compatibility
export type ScrollAreaProps = ScrollAreaRootProps;
export type ScrollBarProps = ScrollAreaBarProps;

export function ScrollArea({ className, style, children }: ScrollAreaRootProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} style={style}>
      <div
        className="h-full w-full rounded-[inherit]"
        data-radix-scroll-area-viewport=""
        style={{ overflow: "auto" }}
      >
        {children}
      </div>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

ScrollArea.displayName = "ScrollArea";

export function ScrollBar({
  className,
  style,
  orientation = "vertical",
}: ScrollAreaBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        "data-[state=hidden]:hidden",
        orientation === "vertical" && "h-full w-1.5 border-l border-l-transparent p-px",
        orientation === "horizontal" && "h-1.5 flex-col border-t border-t-transparent p-px",
        className,
      )}
      style={style}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

ScrollBar.displayName = "ScrollBar";
