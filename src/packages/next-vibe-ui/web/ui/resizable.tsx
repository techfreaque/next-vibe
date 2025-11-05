"use client";

import { DragHandleDots2Icon } from 'next-vibe-ui/ui/icons';
import { cn } from "next-vibe/shared/utils/utils";
import type { ComponentProps, JSX, ReactNode } from "react";
import { forwardRef } from "react";
import * as ResizablePrimitive from "react-resizable-panels";

// Cross-platform props interfaces
export interface ResizablePanelGroupProps {
  children: ReactNode;
  className?: string;
  direction: "horizontal" | "vertical";
  autoSaveId?: string | null;
  id?: string | null;
  keyboardResizeBy?: number | null;
  onLayout?: (sizes: number[]) => void;
  storage?: {
    getItem: (name: string) => string | null;
    setItem: (name: string, value: string) => void;
  };
  tagName?: keyof HTMLElementTagNameMap;
}

export interface ResizablePanelProps extends ComponentProps<typeof ResizablePrimitive.Panel> {
  children: ReactNode;
  className?: string;
  defaultSize?: number;
}

export interface ResizableHandleProps extends ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  className?: string;
  withHandle?: boolean;
}

const ResizablePanelGroup = forwardRef<
  ResizablePrimitive.ImperativePanelGroupHandle,
  ResizablePanelGroupProps
>(({ className, children, direction, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    direction={direction}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className,
    )}
    {...props}
  >
    {children}
  </ResizablePrimitive.PanelGroup>
));

ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: ResizableHandleProps): JSX.Element => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
