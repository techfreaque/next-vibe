import * as React from "react";
import type { TextProps } from "react-native";
import { Text as RNText } from "react-native";

import type { SpanProps as WebSpanProps } from "@/packages/next-vibe-ui/web/ui/span";
import { cn } from "../lib/utils";

// Native Span extends TextProps (native) with web SpanProps for cross-platform compatibility
export type SpanProps = TextProps &
  Pick<WebSpanProps, "id"> & {
    className?: string;
  };

// Native: Use Text component (inline text in React Native)
export function Span({ className, children, id, ...props }: SpanProps): React.JSX.Element {
  return (
    <RNText
      className={cn("text-base text-foreground", className)}
      nativeID={id}
      {...props}
    >
      {children}
    </RNText>
  );
}
