/**
 * Resizable Component for React Native
 * Simple implementation without actual resizing (React Native doesn't support drag-to-resize)
 * Provides layout structure similar to web version
 */
import { GripVertical } from "lucide-react-native";
import React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import { cn } from "../lib/utils";
import type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
} from "next-vibe-ui/ui/resizable";

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

export const ResizablePanelGroup = React.forwardRef<
  View,
  ResizablePanelGroupProps
>(function ResizablePanelGroup({ className, direction = "horizontal", children }, ref) {
  return (
    <StyledView
      ref={ref}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
    >
      {children}
    </StyledView>
  );
});

ResizablePanelGroup.displayName = "ResizablePanelGroup";

export const ResizablePanel = React.forwardRef<View, ResizablePanelProps>(
  function ResizablePanel({ className, children }, ref) {
    return (
      <StyledView ref={ref} className={cn("flex-1", className)}>
        {children}
      </StyledView>
    );
  },
);

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
