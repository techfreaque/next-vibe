/**
 * Resizable Component for React Native
 * Simple implementation without actual resizing (React Native doesn't support drag-to-resize)
 * Provides layout structure similar to web version
 */
import { GripVertical } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
} from "@/packages/next-vibe-ui/web/ui/resizable";

import { styled } from "nativewind";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View, { className: "style" });

export function ResizablePanelGroup({
  className,
  direction = "horizontal",
  children,
}: ResizablePanelGroupProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
    >
      {children}
    </StyledView>
  );
}

ResizablePanelGroup.displayName = "ResizablePanelGroup";

export function ResizablePanel({
  className,
  children,
}: ResizablePanelProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex-1", className)}>{children}</StyledView>
  );
}

ResizablePanel.displayName = "ResizablePanel";

export function ResizableHandle({
  withHandle,
  className,
}: ResizableHandleProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "relative flex w-px items-center justify-center bg-border",
        className,
      )}
    >
      {withHandle && (
        <StyledView className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical size={10} color="currentColor" />
        </StyledView>
      )}
    </StyledView>
  );
}

ResizableHandle.displayName = "ResizableHandle";
