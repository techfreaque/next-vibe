import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { AspectRatioRootProps } from "@/packages/next-vibe-ui/web/ui/aspect-ratio";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";

const StyledAspectRatioRoot = styledNative(AspectRatioPrimitive.Root);

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
