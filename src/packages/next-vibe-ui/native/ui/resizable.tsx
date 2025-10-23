/**
 * Resizable Component for React Native
 * Simple implementation without actual resizing (React Native doesn't support drag-to-resize)
 * Provides layout structure similar to web version
 */
import { GripVertical } from "lucide-react-native";
import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";

import { cn } from "../lib/utils";

interface ResizablePanelGroupProps {
  children: ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}

export const ResizablePanelGroup = React.forwardRef<
  View,
  ResizablePanelGroupProps
>(({ className, direction = "horizontal", children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "flex h-full w-full",
      direction === "vertical" ? "flex-col" : "flex-row",
      className,
    )}
    {...props}
  >
    {children}
  </View>
));

ResizablePanelGroup.displayName = "ResizablePanelGroup";

interface ResizablePanelProps {
  children: ReactNode;
  className?: string;
  defaultSize?: number;
}

export const ResizablePanel = React.forwardRef<View, ResizablePanelProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("flex-1", className)} {...props}>
      {children}
    </View>
  ),
);

ResizablePanel.displayName = "ResizablePanel";

interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
}

export function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "relative flex w-px items-center justify-center bg-border",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <View className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
        </View>
      )}
    </View>
  );
}

ResizableHandle.displayName = "ResizableHandle";
