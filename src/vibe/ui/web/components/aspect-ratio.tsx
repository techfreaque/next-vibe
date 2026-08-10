"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

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
