/**
 * Toast Component for React Native
 * Simple toast notification system
 */
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { cn } from "../lib/utils";

// Cross-platform base props interfaces
export interface ToastBaseProps {
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface ToastTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface ToastDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export interface ToastCloseProps {
  className?: string;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastViewportProps {
  className?: string;
}

export interface ToastActionProps {
  children: React.ReactNode;
  className?: string;
  altText?: string;
}

export type ToastActionElement = React.ReactElement<ToastActionProps>;

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

  const AnimatedView = Animated.View;

  return (
    <AnimatedView
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
    </AnimatedView>
  );
}

export function ToastTitle({
  children,
  className,
}: ToastTitleProps): React.JSX.Element {
  return (
    <RNText
      className={cn("font-semibold text-foreground", className)}
    >
      {children}
    </RNText>
  );
}

export function ToastDescription({
  children,
  className,
}: ToastDescriptionProps): React.JSX.Element {
  return (
    <RNText
      className={cn("text-sm text-muted-foreground mt-1", className)}
    >
      {children}
    </RNText>
  );
}

export function ToastClose({
  className,
}: ToastCloseProps & { onPress?: () => void }): React.JSX.Element {
  return (
    <Pressable
      className={cn("absolute top-2 right-2 p-1", className)}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <RNText
        className="text-foreground"
      >
        ✕
      </RNText>
    </Pressable>
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
    <View
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
    <Pressable
      className={cn("mt-2 rounded px-3 py-2 bg-primary", className)}
      accessibilityRole="button"
    >
      <RNText
        className="text-primary-foreground text-sm font-medium"
      >
        {children}
      </RNText>
    </Pressable>
  );
}

export default Toast;
