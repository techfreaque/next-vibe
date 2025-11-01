import type { Href } from "expo-router";
import { Link as ExpoLink } from "expo-router";
import * as React from "react";
import { Text as RNText, Pressable } from "react-native";

import { cn } from "../lib/utils";

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
const Link = React.forwardRef<React.ElementRef<typeof ExpoLink>, LinkProps>(
  ({ className, children, asChild: _asChild, href, ...props }, ref) => {
    return (
      <ExpoLink
        ref={ref}
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
  },
);

Link.displayName = "Link";

export { Link };
