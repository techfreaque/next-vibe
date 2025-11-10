"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform props interfaces
export interface ScrollAreaRootProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  children: React.ReactNode;
}

export interface ScrollAreaViewportProps
  extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  children: React.ReactNode;
}

export interface ScrollAreaBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export interface ScrollAreaThumbProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaThumb
  > {
  className?: string;
}

export interface ScrollAreaCornerProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.Corner
  > {
  className?: string;
}

// Legacy alias for backwards compatibility
export type ScrollAreaProps = ScrollAreaRootProps;
export type ScrollBarProps = ScrollAreaBarProps;

export function ScrollArea({ className, children, ...props }: ScrollAreaRootProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full w-full rounded-[inherit]"
        data-radix-scroll-area-viewport=""
        style={{ overflow: "hidden scroll" }}
      >
        {children}
      </div>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

ScrollArea.displayName = "ScrollArea";

export function ScrollBar({ className, orientation = "vertical", ...props }: ScrollAreaBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        "data-[state=hidden]:hidden",
        orientation === "vertical" &&
          "h-full w-1.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-1.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

ScrollBar.displayName = "ScrollBar";
