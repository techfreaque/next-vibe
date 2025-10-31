/**
 * Resizable Component for React Native
 * Simple implementation without actual resizing (React Native doesn't support drag-to-resize)
 * Provides layout structure similar to web version
 */
import { GripVertical } from "lucide-react-native";
import React from "react";
import { View as RNView } from "react-native";

import type { ViewPropsWithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
} from "next-vibe-ui/ui/resizable";

// Type-safe View component with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;

export const ResizablePanelGroup = React.forwardRef<
  RNView,
  ResizablePanelGroupProps
>(function ResizablePanelGroup({ className, direction = "horizontal", children }, ref) {
  return (
    <View
      ref={ref}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
    >
      {children}
    </View>
  );
});

ResizablePanelGroup.displayName = "ResizablePanelGroup";

export const ResizablePanel = React.forwardRef<RNView, ResizablePanelProps>(
  function ResizablePanel({ className, children }, ref) {
    return (
      <View ref={ref} className={cn("flex-1", className)}>
        {children}
      </View>
    );
  },
);

ResizablePanel.displayName = "ResizablePanel";

export function ResizableHandle({
  withHandle,
  className,
}: ResizableHandleProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "relative flex w-px items-center justify-center bg-border",
        className,
      )}
    >
      {withHandle && (
        <View className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical size={10} color="currentColor" />
        </View>
      )}
    </View>
  );
}

ResizableHandle.displayName = "ResizableHandle";
