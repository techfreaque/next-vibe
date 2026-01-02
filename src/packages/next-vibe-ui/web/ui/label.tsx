"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export interface LabelRootProps {
  children?: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function Label({ className, ...props }: LabelRootProps): React.JSX.Element {
  return <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />;
}
Label.displayName = LabelPrimitive.Root.displayName;
