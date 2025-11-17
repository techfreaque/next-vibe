import type { JSX } from "react";
import * as React from "react";
import { Text } from "react-native";
import type { TextStyle } from "react-native";
import { styled } from "nativewind";

import type { PreProps } from "@/packages/next-vibe-ui/web/ui/pre";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToTextStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

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
