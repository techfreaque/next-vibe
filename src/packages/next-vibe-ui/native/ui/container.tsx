/**
 * Container Component for React Native
 * Provides consistent max-width and padding for app pages
 */
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { View } from "react-native";

// Import ALL types from web - ZERO definitions here
import type { ContainerProps } from "@/packages/next-vibe-ui/web/ui/container";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export function Container({
  children,
  className,
  style,
  size = "lg",
}: ContainerProps): React.JSX.Element {
  const effectiveSize = size ?? "lg";
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "mx-auto px-4 sm:px-6 py-8",
          sizeClasses[effectiveSize],
          className,
        ),
      })}
    >
      {children}
    </StyledView>
  );
}
