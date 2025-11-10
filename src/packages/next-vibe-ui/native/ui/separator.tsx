import * as SeparatorPrimitive from "@rn-primitives/separator";
import * as React from "react";

import type { SeparatorRootProps } from "@/packages/next-vibe-ui/web/ui/separator";
import { cn } from "next-vibe/shared/utils/utils";
import { styled } from "nativewind";

export type { SeparatorRootProps };

// Styled component using nativewind
const StyledSeparatorRoot = styled(SeparatorPrimitive.Root);

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
}: SeparatorRootProps): React.JSX.Element {
  return (
    <StyledSeparatorRoot
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
    />
  );
}
