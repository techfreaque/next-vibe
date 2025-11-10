"use custom";

/**
 * Threads Layout for React Native
 * Non-scrollable layout - chat/threads handle their own scrolling
 * Provides safe area wrapper without ScrollView
 */

import { Slot } from "expo-router";
import { SafeAreaLayout } from "next-vibe-ui/ui/safe-area-layout";
import type { JSX } from "react";

export default function ThreadsLayoutNative(): JSX.Element {
  return (
    <SafeAreaLayout>
      <Slot />
    </SafeAreaLayout>
  );
}

