import type { Href } from "expo-router";
import { Link as ExpoLink } from "expo-router";
import * as React from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";

interface LinkProps {
  href: Href;
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

/**
 * Link component for React Native using Expo Router Link
 */
const Link = React.forwardRef<React.ElementRef<typeof ExpoLink>, LinkProps>(
  ({ className, children, asChild: _asChild, href, ...props }, ref) => {
    return (
      <ExpoLink
        ref={ref}
        href={href}
        className={cn(
          "text-primary underline-offset-4 active:underline",
          className,
        )}
        {...props}
      >
        {typeof children === "string" ? <RNText>{children}</RNText> : children}
      </ExpoLink>
    );
  },
);

Link.displayName = "Link";

export { Link };
