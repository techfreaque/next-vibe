"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

export type AspectRatioRootProps = {
  ratio?: number;
  children?: React.ReactNode;
} & StyleType;

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
