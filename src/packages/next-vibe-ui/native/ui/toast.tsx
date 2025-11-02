/**
 * Toast Component for React Native
 * Simple toast notification system
 */
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { cn } from "../lib/utils";

const StyledAnimatedView = Animated.View as React.ComponentType<React.ComponentProps<typeof Animated.View> & { className?: string }>;
const StyledText = RNText as React.ComponentType<React.ComponentProps<typeof RNText> & { className?: string }>;
const StyledPressable = Pressable as React.ComponentType<React.ComponentProps<typeof Pressable> & { className?: string }>;
const StyledView = View as React.ComponentType<React.ComponentProps<typeof View> & { className?: string }>;

import type {
  ToastActionElement,
  ToastActionProps,
  ToastBaseProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastTitleProps,
  ToastViewportProps,
} from "../../web/ui/toast";

export type {
  ToastActionElement,
  ToastActionProps,
  ToastBaseProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastTitleProps,
  ToastViewportProps,
};

export type ToastProps = ToastBaseProps;

export function Toast({
  variant = "default",
  open = true,
  children,
  className,
}: ToastProps): React.JSX.Element | null {
  if (!open) {
    return null;
  }

  return (
    <StyledAnimatedView
      entering={FadeInUp}
      exiting={FadeOutUp}
      className={cn(
        "rounded-lg border p-4 shadow-lg",
        variant === "destructive"
          ? "border-destructive bg-destructive"
          : "border-border bg-background",
        className,
      )}
    >
      {children}
    </StyledAnimatedView>
  );
}

export function ToastTitle({
  children,
  className,
}: ToastTitleProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("font-semibold text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}

export function ToastDescription({
  children,
  className,
}: ToastDescriptionProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("text-sm text-muted-foreground mt-1", className)}
    >
      {children}
    </StyledText>
  );
}

export function ToastClose({
  className,
  accessibilityLabel = "Close",
}: ToastCloseProps & { onPress?: () => void; accessibilityLabel?: string }): React.JSX.Element {
  return (
    <StyledPressable
      className={cn("absolute top-2 right-2 p-1", className)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <StyledText
        className="text-foreground"
      >
        ✕
      </StyledText>
    </StyledPressable>
  );
}

export function ToastProvider({
  children,
}: ToastProviderProps): React.JSX.Element {
  return <>{children}</>;
}

export function ToastViewport({
  className,
}: ToastViewportProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "absolute top-0 left-0 right-0 p-4 pointer-events-none",
        className,
      )}
    />
  );
}

export function ToastAction({
  children,
  className,
}: ToastActionProps & { onPress?: () => void }): React.JSX.Element {
  return (
    <StyledPressable
      className={cn("mt-2 rounded px-3 py-2 bg-primary", className)}
      accessibilityRole="button"
    >
      <StyledText
        className="text-primary-foreground text-sm font-medium"
      >
        {children}
      </StyledText>
    </StyledPressable>
  );
}

export default Toast;
