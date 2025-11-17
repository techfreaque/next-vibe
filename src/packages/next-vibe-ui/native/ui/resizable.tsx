/**
 * Resizable Component for React Native
 * Simple fixed-width container (React Native doesn't support mouse drag-to-resize)
 */
import { GripVertical } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  ResizableContainerProps,
  ResizableHandleProps,
} from "@/packages/next-vibe-ui/web/ui/resizable";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import { styled } from "nativewind";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View, { className: "style" });

export function ResizableContainer({
  children,
  className,
  defaultWidth = 260,
}: ResizableContainerProps): React.JSX.Element {
  return (
    <StyledView
      className={cn("relative h-full flex-shrink-0", className)}
      style={{ width: defaultWidth }}
    >
      {children}
    </StyledView>
  );
}

ResizableContainer.displayName = "ResizableContainer";

export function ResizableHandle({
  withHandle,
  className,
  style,
}: ResizableHandleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute top-0 right-0 bottom-0 w-px items-center justify-center bg-border",
          className,
        ),
      })}
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

export type { ResizableContainerProps, ResizableHandleProps };
