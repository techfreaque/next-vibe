/**
 * Platform-agnostic Form element component for native
 * On native, this is a View component (forms don't exist in RN)
 * Uses exact same interface as web version
 */

import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

// Cross-platform props interface - native version uses ViewProps
export interface FormElementProps extends ViewProps {
  className?: string;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
}

/**
 * Native implementation using View
 * Accepts web props but only applies what View supports
 */
export const FormElement = forwardRef(function FormElement(
  props: FormElementProps,
  ref: ForwardedRef<View>,
) {
  // Extract web-specific props that don't apply to View
  const { onSubmit: _onSubmit, ...viewProps } = props;

  return <View ref={ref} {...viewProps} />;
});
