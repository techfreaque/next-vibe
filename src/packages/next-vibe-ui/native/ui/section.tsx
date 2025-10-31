import * as React from "react";
import { View } from "react-native";

import type { SectionProps } from "next-vibe-ui/ui/section";

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
    <View ref={ref} className={className} nativeID={id}>
      {children}
    </View>
  );
});
