"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types for native import
export interface AspectRatioRootProps {
  className?: string;
  ratio?: number;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: Record<string, any>;
}

export function AspectRatio({
  className,
  ratio = 16 / 9,
  children,
  ...props
}: AspectRatioRootProps): React.JSX.Element {
  return (
    <AspectRatioPrimitive.Root
      ratio={ratio}
      className={cn(className)}
      {...props}
    >
      {children}
    </AspectRatioPrimitive.Root>
  );
}
