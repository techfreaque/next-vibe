import { Link as ExpoLink } from "expo-router";
import { Text as RNText } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

import type { LinkBaseProps as LinkProps } from "../../web/ui/link";

const StyledText = styled(RNText, {
  className: "style",
});
const StyledLink = styled(ExpoLink, {
  className: "style",
});

/**
 * Link component for React Native using Expo Router Link
 * Simple implementation that wraps all children in a clickable Text component
 */
export function Link({
  className,
  children,
  asChild: _asChild,
  href,
  ...props
}: LinkProps): React.JSX.Element {
  return (
    <StyledLink href={href} asChild {...props}>
      <StyledText
        className={cn(
          "text-primary underline-offset-4 active:underline",
          className,
        )}
      >
        {children}
      </StyledText>
    </StyledLink>
  );
}
