import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from "expo-router";
import * as React from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";

export interface LinkProps extends ExpoLinkProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Link component for React Native using Expo Router Link
 */
const Link = React.forwardRef<React.ElementRef<typeof ExpoLink>, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ExpoLink
        ref={ref}
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
