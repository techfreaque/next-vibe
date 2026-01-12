import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

import type { PProps } from "../../web/ui/typography";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

const StyledText = styled(Text, { className: "style" });

export function P({ className, style, children }: PProps): React.JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      {...applyStyleType({
        nativeStyle,
        className: cn("leading-7 text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}
