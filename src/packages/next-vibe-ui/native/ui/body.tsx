import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import type { BodyProps } from "../../web/ui/body";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
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
