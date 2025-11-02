import * as SeparatorPrimitive from "@rn-primitives/separator";
import * as React from "react";

import type { SeparatorProps } from "next-vibe-ui/ui/separator";
import { cn } from "next-vibe/shared/utils/utils";
import { styled } from "nativewind";

// Styled component using nativewind
const StyledSeparatorRoot = styled(SeparatorPrimitive.Root);

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps): React.JSX.Element {
  return (
    <StyledSeparatorRoot
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  );
}
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
