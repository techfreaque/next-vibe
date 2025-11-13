import { Text } from "react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";

import type {
  H1Props,
  H2Props,
  H3Props,
  H4Props,
} from "../../web/ui/typography";

const StyledText = styled(Text, { className: "style" });

export function H1({
  className,
  children,
}: H1Props): React.JSX.Element {
  return (
    <StyledText
      accessibilityRole="header"
      className={cn("text-4xl font-bold text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}

export function H2({
  className,
  children,
}: H2Props): React.JSX.Element {
  return (
    <StyledText
      accessibilityRole="header"
      className={cn("text-3xl font-bold text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}

export function H3({
  className,
  children,
}: H3Props): React.JSX.Element {
  return (
    <StyledText
      accessibilityRole="header"
      className={cn("text-2xl font-bold text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}

export function H4({
  className,
  children,
}: H4Props): React.JSX.Element {
  return (
    <StyledText
      accessibilityRole="header"
      className={cn("text-xl font-bold text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}
