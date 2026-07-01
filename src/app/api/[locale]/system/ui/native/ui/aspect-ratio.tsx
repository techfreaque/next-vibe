import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import { cn } from "next-vibe/core/utils/utils";
import {
  convertCSSToViewStyle,
  styledNative,
} from "next-vibe/ui/native/utils/style-converter";
import type { AspectRatioRootProps } from "next-vibe/ui/web/ui/aspect-ratio";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";

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
