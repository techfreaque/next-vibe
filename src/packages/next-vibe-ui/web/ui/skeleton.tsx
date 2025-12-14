import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";

import type { StyleType } from "../utils/style-type";

export type SkeletonProps = {
  children?: React.ReactNode;
} & StyleType;

function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
