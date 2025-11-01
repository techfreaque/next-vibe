import * as React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import type { SectionProps } from "next-vibe-ui/ui/section";

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

/**
 * Platform-agnostic Section component for native
 * On native, this is a View component (semantic sections don't exist in RN)
 * Provides consistent API across platforms
 */
export const Section = React.forwardRef<View, SectionProps>(function Section(
  { children, className, id },
  ref,
) {
  return (
    <StyledView ref={ref} className={className} nativeID={id}>
      {children}
    </StyledView>
  );
});
