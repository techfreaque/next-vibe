import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

/**
 * Platform-agnostic Section component for native
 * On native, this is a View component (semantic sections don't exist in RN)
 * Provides consistent API across platforms
 */
export const Section = forwardRef(function Section(
  props: ViewProps,
  ref: ForwardedRef<View>,
) {
  return <View ref={ref} {...props} />;
});
