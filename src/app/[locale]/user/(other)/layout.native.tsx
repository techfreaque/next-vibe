"use custom";

/**
 * User Auth Layout for React Native
 * Scrollable layout with keyboard handling for signup/login pages
 */

import { Slot } from "expo-router";
import { ScrollableSafeAreaLayout } from "next-vibe-ui/ui/safe-area-layout";
import type { JSX } from "react";

export default function UserAuthLayoutNative(): JSX.Element {
  return (
    <ScrollableSafeAreaLayout>
      <Slot />
    </ScrollableSafeAreaLayout>
  );
}

