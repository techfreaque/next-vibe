"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface ProgressRootProps {
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number, max: number) => string;
  children?: React.ReactNode;
  className?: string;
}

export interface ProgressIndicatorProps {
  className?: string;
  value?: number | null;
  children?: React.ReactNode;
}

export function Progress({
  className,
  value,
  max,
  getValueLabel,
  children,
  ...props
}: ProgressRootProps): React.JSX.Element {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      value={value ?? undefined}
      max={max}
      getValueLabel={getValueLabel}
      {...props}
    >
      {children ?? <ProgressIndicator value={value} />}
    </ProgressPrimitive.Root>
  );
}
Progress.displayName = ProgressPrimitive.Root.displayName;

export function ProgressIndicator({
  className,
  value,
  ...props
}: ProgressIndicatorProps): React.JSX.Element {
  return (
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        className,
      )}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      {...props}
    />
  );
}
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName;
