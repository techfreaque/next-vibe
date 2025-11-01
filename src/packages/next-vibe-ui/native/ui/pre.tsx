import type { JSX } from "react";
import * as React from "react";
import type { TextProps } from "react-native";
import { Text } from "react-native";

import type { PreProps } from "next-vibe-ui/ui/pre";
import { cn } from "../lib/utils";

// Type-safe Text with className support (NativeWind)
const StyledText = Text as unknown as React.ForwardRefExoticComponent<
  TextProps & { className?: string } & React.RefAttributes<Text>
>;

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
