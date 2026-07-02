import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import { cn } from "next-vibe/core/utils/utils";
import * as React from "react";

import {
  convertCSSToViewStyle,
  styledNative,
} from "../../native/utils/style-converter";
import type { AspectRatioRootProps } from "../../web/ui/aspect-ratio";
import { applyStyleType } from "../../web/utils/style-type";

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
