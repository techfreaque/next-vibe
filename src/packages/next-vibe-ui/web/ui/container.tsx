/**
 * Container Component
 * Provides consistent max-width and padding for app pages that don't need full width
 */

import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

// Cross-platform props interface
export type ContainerProps = {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
} & StyleType;

const sizeClasses = {
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
}: ContainerProps): JSX.Element {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 py-8",
        sizeClasses[size],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
