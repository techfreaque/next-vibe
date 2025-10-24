import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

/**
 * Platform-agnostic Form element component for native
 * On native, this is a View component (forms don't exist in RN)
 * Provides consistent API across platforms
 */
export const FormElement = forwardRef(function FormElement(
  props: ViewProps,
  ref: ForwardedRef<View>,
) {
  return <View ref={ref} {...props} />;
});
