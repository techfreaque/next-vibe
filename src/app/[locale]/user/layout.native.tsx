"use custom";

/**
 * User Layout for React Native
 * Scrollable layout with keyboard handling for user profile pages
 */

import { Slot } from "expo-router";
import { ScrollableSafeAreaLayout } from "next-vibe-ui/ui/safe-area-layout";
import type { JSX } from "react";

export default function UserLayoutNative(): JSX.Element {
  return (
    <ScrollableSafeAreaLayout>
      <Slot />
    </ScrollableSafeAreaLayout>
  );
}

