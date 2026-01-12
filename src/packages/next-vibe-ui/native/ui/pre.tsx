import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";
import * as React from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

import type { PreProps } from "@/packages/next-vibe-ui/web/ui/pre";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

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
