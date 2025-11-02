import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import type { SectionProps } from "next-vibe-ui/ui/section";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Section component for native
 * On native, this is a View component (semantic sections don't exist in RN)
 * Provides consistent API across platforms
 */
export function Section({ children, className, id }: SectionProps): React.JSX.Element {
  return (
    <StyledView className={className} nativeID={id}>
      {children}
    </StyledView>
  );
}
