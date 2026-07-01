// Native implementation with optional scrolling
// Note: SafeAreaView is already provided by Body component at root level
import React from "react";
import { Platform, ScrollView, View } from "react-native";

// Import types from web
import type { PageLayoutProps } from "@/packages/next-vibe-ui/web/ui/page-layout";

import { styledNative } from "../utils/style-converter";

// Styled components with explicit className mapping
const StyledView = styledNative(View);
const StyledScrollView = styledNative(ScrollView);

/**
 * PageLayout - Cross-platform page wrapper
 * Native: Optional scrolling based on scrollable prop
 * Note: SafeAreaView is already provided by Body component at root level
 */
export function PageLayout({
  children,
  className,
  scrollable = true,
}: PageLayoutProps): React.JSX.Element {
  if (!scrollable) {
    // Non-scrollable layout (for pages that handle their own scrolling like chat)
    // Use full height wrapper - Body already provides SafeAreaView
    return <StyledView className="h-full">{children}</StyledView>;
  }

  // Scrollable layout with keyboard handling (for most pages)
  return (
    <StyledScrollView
      className={className}
      scrollEnabled={true}
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
  );
}

PageLayout.displayName = "PageLayout";
