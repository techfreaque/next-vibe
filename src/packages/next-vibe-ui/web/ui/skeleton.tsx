import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

export interface SkeletonProps {
  children?: React.ReactNode;
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
}

export { Skeleton };
