import { Stack } from "expo-router";
import type { JSX } from "react";
import type { RootStackProps } from "next-vibe-ui/ui/root-stack";

/**
 * Platform-agnostic RootStack component (Native implementation)
 * Wraps Expo Router Stack for consistent root layout interface
 */
export function RootStack({ children: _children }: RootStackProps): JSX.Element {
  return <Stack />;
}
