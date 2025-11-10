"use custom";

/**
 * Story Layout for React Native
 * Scrollable layout with keyboard handling for story/marketing pages
 */

import { Slot } from "expo-router";
import { ScrollableSafeAreaLayout } from "next-vibe-ui/ui/safe-area-layout";
import type { JSX } from "react";

export default function StoryLayoutNative(): JSX.Element {
  return (
    <ScrollableSafeAreaLayout>
      <Slot />
    </ScrollableSafeAreaLayout>
  );
}

