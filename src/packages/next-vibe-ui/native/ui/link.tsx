import type { Href } from "expo-router";
import { Link as ExpoLink } from "expo-router";
import { Text as RNText } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { LinkBaseProps } from "../../web/ui/link";

// Native-specific LinkProps that uses Expo Router's Href type and extends base props
interface LinkProps extends LinkBaseProps {
  href: Href;
}

/**
 * Link component for React Native using Expo Router Link
 * Simple implementation that wraps all children in a clickable Text component
 */
export function Link({ className, children, asChild: _asChild, href, ...props }: LinkProps): React.JSX.Element {
  return (
    <ExpoLink
      href={href}
      asChild
      {...props}
    >
      <RNText
        className={cn(
          "text-primary underline-offset-4 active:underline",
          className,
        )}
      >
        {children}
      </RNText>
    </ExpoLink>
  );
}
