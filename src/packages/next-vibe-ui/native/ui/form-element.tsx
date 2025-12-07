/**
 * Platform-agnostic Form element component for native
 * On native, this is a View component (forms don't exist in RN)
 * Uses exact same interface as web version
 */

import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { styled } from "nativewind";

// Import all types from web version (web is source of truth)
import type {
  FormElementProps,
  FormElementRefObject,
} from "../../web/ui/form-element";

const StyledView = styled(View, { className: "style" });

/**
 * Native implementation using View
 * Accepts web props but only applies what View supports
 */
export const FormElement = forwardRef(function FormElement(
  props: FormElementProps,
  ref: ForwardedRef<FormElementRefObject>,
) {
  // Extract web-specific props that don't apply to View
  const { onSubmit: _onSubmit, className, children } = props;
  const viewRef = useRef<View>(null);

  useImperativeHandle(ref, (): FormElementRefObject => {
    return {
      submit: (): void => {
        // No-op for React Native - forms are web-only concept
      },
      reset: (): void => {
        // No-op for React Native
      },
      focus: (): void => {
        // No-op for React Native
      },
      blur: (): void => {
        // No-op for React Native
      },
    };
  }, []);

  return (
    <StyledView ref={viewRef} className={className}>
      {children}
    </StyledView>
  );
});
