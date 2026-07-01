"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

export type SeparatorRootProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
} & StyleType;

export function Separator({
  className,
  style,
  orientation = "horizontal",
  decorative = true,
}: SeparatorRootProps): React.JSX.Element {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      style={style}
    />
  );
}
