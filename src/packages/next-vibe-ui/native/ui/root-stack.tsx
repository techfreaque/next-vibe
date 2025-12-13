import { Stack } from "expo-router";
import type { JSX } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Type available for documentation
import type { RootStackProps } from "@/packages/next-vibe-ui/web/ui/root-stack";

/**
 * Platform-agnostic RootStack component (Native implementation)
 * Wraps Expo Router Stack for consistent root layout interface
 */
export function RootStack(): JSX.Element {
  return <Stack />;
}
