"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

// Cross-platform props interface
export interface LabelRootProps {
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string;
  nativeID?: string;
}

export function Label({
  className,
  ...props
}: LabelRootProps): React.JSX.Element {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
}
Label.displayName = LabelPrimitive.Root.displayName;
