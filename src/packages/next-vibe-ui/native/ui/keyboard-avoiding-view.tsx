import React from "react";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";

// Import ALL types from web - ZERO definitions here
import type { KeyboardAvoidingViewProps } from "@/packages/next-vibe-ui/web/ui/keyboard-avoiding-view";

const StyledKeyboardAvoidingView = styled(RNKeyboardAvoidingView);

/**
 * Platform-agnostic KeyboardAvoidingView component for React Native
 * Wraps React Native's KeyboardAvoidingView with NativeWind className support
 */
export const KeyboardAvoidingView = React.forwardRef<
  RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps
>(
  (
    { children, className, behavior, keyboardVerticalOffset = 0, style },
    ref,
  ) => {
    // Use platform-specific default behavior if not provided
    const defaultBehavior = Platform.OS === "ios" ? "padding" : "height";

    return (
      <StyledKeyboardAvoidingView
        ref={ref}
        className={className}
        behavior={behavior ?? defaultBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={style}
      >
        {children}
      </StyledKeyboardAvoidingView>
    );
  },
);

KeyboardAvoidingView.displayName = "KeyboardAvoidingView";
