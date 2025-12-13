import * as React from "react";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from "react-native";
import type { ViewStyle } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type { KeyboardAvoidingViewProps } from "@/packages/next-vibe-ui/web/ui/keyboard-avoiding-view";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledKeyboardAvoidingView = styled(RNKeyboardAvoidingView, {
  className: "style",
});

/**
 * Platform-agnostic KeyboardAvoidingView component for React Native
 * Wraps React Native's KeyboardAvoidingView with NativeWind className support
 * Implements FULL feature parity with web version
 */
export function KeyboardAvoidingView({
  children,
  className,
  behavior,
  keyboardVerticalOffset = 0,
  style,
}: KeyboardAvoidingViewProps): React.JSX.Element {
  // Convert web CSSProperties to native ViewStyle if style is provided
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  // Use platform-specific default behavior if not provided
  const defaultBehavior = Platform.OS === "ios" ? "padding" : "height";
  const effectiveBehavior = behavior ?? defaultBehavior;

  // Combine className and style - both can be used simultaneously
  // This matches web behavior where className and style can coexist
  const combinedStyle = nativeStyle;
  const combinedClassName = cn(className);

  return (
    <StyledKeyboardAvoidingView
      className={combinedClassName}
      style={combinedStyle}
      behavior={effectiveBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </StyledKeyboardAvoidingView>
  );
}

KeyboardAvoidingView.displayName = "KeyboardAvoidingView";
