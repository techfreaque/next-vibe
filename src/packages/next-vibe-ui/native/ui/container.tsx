/**
 * Container Component for React Native
 * Provides consistent max-width and padding for app pages
 */
import type { ReactNode } from "react";
import { View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Cross-platform container props
export interface ContainerProps {
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

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
  size = "lg",
}: ContainerProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "mx-auto px-4 native:px-6 py-8",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </View>
  );
}
