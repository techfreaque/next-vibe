import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { AspectRatioRootProps } from "@/packages/next-vibe-ui/web/ui/aspect-ratio";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledAspectRatioRoot = styled(AspectRatioPrimitive.Root, { className: "style" });

export function AspectRatio({
  className,
  style,
  ratio,
  children,
}: AspectRatioRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledAspectRatioRoot
      ratio={ratio ?? 16 / 9}
      {...applyStyleType({
        nativeStyle,
        className: cn(className),
      })}
    >
      {children}
    </StyledAspectRatioRoot>
  );
}
