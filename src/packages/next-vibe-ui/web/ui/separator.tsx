"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

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
