import { styled } from "nativewind";
import { cn } from "../../../unified-ui/_shared/cn";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { convertCSSToViewStyle } from "../utils/style-converter";
import type { BodyProps } from "../../web/ui/body";
import { applyStyleType } from "../../web/utils/style-type";

const StyledSafeAreaView = styled(SafeAreaView, { className: "style" });

export function Body({
  children,
  className,
  style,
}: BodyProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledSafeAreaView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex-1 bg-background", className),
      })}
    >
      {children}
    </StyledSafeAreaView>
  );
}
