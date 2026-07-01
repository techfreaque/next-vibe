import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToTextStyle } from "next-vibe/ui/native/utils/style-converter";
import type { PProps } from "next-vibe/ui/web/ui/typography";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

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
