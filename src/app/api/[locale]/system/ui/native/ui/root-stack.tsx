import { Stack } from "expo-router";
import type { RootStackProps } from "next-vibe/ui/web/ui/root-stack";
import type { JSX } from "react";

/**
 * Platform-agnostic RootStack component (Native implementation)
 * Wraps Expo Router Stack for consistent root layout interface
 */
// oxlint-disable-next-line no-unused-vars
export function RootStack({ children }: RootStackProps): JSX.Element {
  return <Stack />;
}
