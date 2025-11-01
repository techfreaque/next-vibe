/**
 * Platform-agnostic Form element component for native
 * On native, this is a View component (forms don't exist in RN)
 * Uses exact same interface as web version
 */

import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { View } from "react-native";

// Import all types from web version (web is source of truth)
import type { FormElementProps } from "../../web/ui/form-element";

/**
 * Native implementation using View
 * Accepts web props but only applies what View supports
 */
export const FormElement = forwardRef(function FormElement(
  props: FormElementProps,
  ref: ForwardedRef<View>,
) {
  // Extract web-specific props that don't apply to View
  const { onSubmit: _onSubmit, className, children } = props;

  return (
    <View ref={ref} className={className}>
      {children}
    </View>
  );
});
