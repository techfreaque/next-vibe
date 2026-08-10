import { styled } from "nativewind";
import React from "react";
import {
  SafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";

import { cn } from "../../../unified-ui/_shared/cn";
import type { BodyProps } from "../../web/ui/body";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledSafeAreaView: React.ComponentType<
  SafeAreaViewProps & { className?: string }
> =
  // @ts-expect-error: union too complex for TS
  styled(SafeAreaView, { className: "style" });

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
