import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToViewStyle } from "next-vibe/ui/native/utils/style-converter";
import type { BodyProps } from "next-vibe/ui/web/ui/body";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

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
