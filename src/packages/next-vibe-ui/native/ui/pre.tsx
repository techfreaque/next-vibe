import type { JSX } from "react";
import * as React from "react";
import { Text } from "react-native";
import { styled } from "nativewind";

import type { PreProps } from "next-vibe-ui/ui/pre";
import { cn } from "next-vibe/shared/utils/utils";

// Type-safe Text with className support (NativeWind)
const StyledText = styled(Text);

export function Pre({ className, children, id }: PreProps): JSX.Element {
  return (
    <StyledText
      className={cn("font-mono text-base text-foreground", className)}
      nativeID={id}
    >
      {children}
    </StyledText>
  );
}
