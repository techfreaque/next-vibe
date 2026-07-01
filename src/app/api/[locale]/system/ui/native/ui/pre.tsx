import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToTextStyle } from "next-vibe/ui/native/utils/style-converter";
import type { PreProps } from "next-vibe/ui/web/ui/pre";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX } from "react";
import * as React from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

const StyledText = styled(Text, { className: "style" });

export function Pre({ className, style, children, id }: PreProps): JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn("font-mono text-base text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}
