import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

// Cross-platform types for native import
export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: `data-${string}`]: string | undefined;
}

function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
