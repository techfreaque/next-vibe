import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToTextStyle } from "next-vibe/ui/native/utils/style-converter";
import type {
  H1Props,
  H2Props,
  H3Props,
  H4Props,
} from "next-vibe/ui/web/ui/typography";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

const StyledText = styled(Text, { className: "style" });

export function H1({ className, style, children }: H1Props): React.JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      accessibilityRole="header"
      {...applyStyleType({
        nativeStyle,
        className: cn("text-4xl font-bold text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

export function H2({ className, style, children }: H2Props): React.JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      accessibilityRole="header"
      {...applyStyleType({
        nativeStyle,
        className: cn("text-3xl font-bold text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

export function H3({ className, style, children }: H3Props): React.JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      accessibilityRole="header"
      {...applyStyleType({
        nativeStyle,
        className: cn("text-2xl font-bold text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}

export function H4({ className, style, children }: H4Props): React.JSX.Element {
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      accessibilityRole="header"
      {...applyStyleType({
        nativeStyle,
        className: cn("text-xl font-bold text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}
