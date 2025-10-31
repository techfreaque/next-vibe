import * as SeparatorPrimitive from "@rn-primitives/separator";
import * as React from "react";

import type { SeparatorProps } from "next-vibe-ui/ui/separator";
import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";

// Type-safe wrapper for Separator primitive
const StyledSeparatorRoot = SeparatorPrimitive.Root as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>> &
    React.RefAttributes<React.ElementRef<typeof SeparatorPrimitive.Root>>
>;

const Separator = React.forwardRef<SeparatorPrimitive.RootRef, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <StyledSeparatorRoot
      ref={ref}
      {...({
        decorative,
        orientation,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        ),
        ...props,
      } as any)}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
