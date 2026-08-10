import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { AspectRatioRootProps } from "../../web/components/aspect-ratio";
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
