import * as React from "react";
import { Text as RNText } from "react-native";

import type { SpanProps } from "@/packages/next-vibe-ui/web/ui/span";
import { cn } from "../lib/utils";
import { styled } from "nativewind";

const StyledText = styled(RNText, { className: "style" });

// Native: Use Text component (inline text in React Native)
export function Span({
  className,
  children,
  id,
  ...props
}: SpanProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-base text-foreground", className)}
      nativeID={id}
      {...props}
    >
      {children}
    </StyledText>
  );
}
