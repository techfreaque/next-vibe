/**
 * Toast Component for React Native
 * Simple toast notification system
 */
import type { ReactNode } from "react";
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { cn } from "../lib/utils";

export interface ToastProps {
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function Toast({
  variant = "default",
  open = true,
  children,
  className,
}: ToastProps): React.JSX.Element | null {
  // TODO: Implement onOpenChange functionality
  if (!open) {
    return null;
  }

  return (
    <Animated.View
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
    </Animated.View>
  );
}

export function ToastTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <RNText className={cn("font-semibold text-foreground", className)}>
      {children}
    </RNText>
  );
}

export function ToastDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <RNText className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </RNText>
  );
}

export function ToastClose({
  onPress,
}: {
  onPress?: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      className="absolute top-2 right-2 p-1"
      accessibilityRole="button"
      accessibilityLabel="Close" // eslint-disable-line i18next/no-literal-string -- Accessibility label
    >
      {/* eslint-disable-next-line i18next/no-literal-string -- Close icon */}
      <RNText className="text-foreground">✕</RNText>
    </Pressable>
  );
}

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}

export function ToastViewport({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <View
      className={cn(
        "absolute top-0 left-0 right-0 p-4 pointer-events-none",
        className,
      )}
    />
  );
}

export type ToastActionElement = React.ReactElement;

export function ToastAction({
  children,
  onPress,
  className,
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      className={cn("mt-2 rounded px-3 py-2 bg-primary", className)}
      accessibilityRole="button"
    >
      <RNText className="text-primary-foreground text-sm font-medium">
        {children}
      </RNText>
    </Pressable>
  );
}

export default Toast;
