import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import * as React from "react";

import type { AspectRatioRootProps } from "@/packages/next-vibe-ui/web/ui/aspect-ratio";
import { cn } from "next-vibe/shared/utils/utils";
import { styled } from "nativewind";

const StyledAspectRatioRoot = styled(AspectRatioPrimitive.Root, { className: "style" });

export function AspectRatio({
  className,
  ratio,
  children,
}: AspectRatioRootProps): React.JSX.Element {
  return (
    <StyledAspectRatioRoot ratio={ratio ?? 16 / 9} className={cn(className)}>
      {children}
    </StyledAspectRatioRoot>
  );
}
