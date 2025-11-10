/**
 * SafeAreaLayout Components for React Native
 * Provides safe area handling with optional scrolling for mobile layouts
 */
import React from "react";
import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

// Import types from web
import type {
  SafeAreaLayoutProps,
  ScrollableSafeAreaLayoutProps,
} from "@/packages/next-vibe-ui/web/ui/safe-area-layout";

// Re-export types
export type { SafeAreaLayoutProps, ScrollableSafeAreaLayoutProps };

// Styled components with NativeWind support - defined locally to avoid type issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledSafeAreaView = styled(SafeAreaView) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledScrollView = styled(ScrollView) as any;

/**
 * SafeAreaLayout - Non-scrollable safe area wrapper
 * Use for routes that handle their own scrolling (e.g., chat/threads)
 */
export function SafeAreaLayout({
  children,
  className,
}: SafeAreaLayoutProps): React.JSX.Element {
  return (
    <StyledSafeAreaView className={cn("flex-1", className)}>
      {children}
    </StyledSafeAreaView>
  );
}

SafeAreaLayout.displayName = "SafeAreaLayout";

/**
 * ScrollableSafeAreaLayout - Scrollable safe area wrapper with keyboard handling
 * Use for most routes that need scrolling and keyboard interaction
 */
export function ScrollableSafeAreaLayout({
  children,
  className,
  scrollEnabled = true,
}: ScrollableSafeAreaLayoutProps): React.JSX.Element {
  return (
    <StyledSafeAreaView className={cn("flex-1", className)}>
      <StyledScrollView
        scrollEnabled={scrollEnabled}
        keyboardDismissMode={Platform.select({
          ios: "interactive",
          android: "on-drag",
        })}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}

ScrollableSafeAreaLayout.displayName = "ScrollableSafeAreaLayout";

