import { Stack } from "expo-router";
import type { JSX } from "react";

import type { RootStackProps } from "../../web/components/root-stack";

/**
 * Platform-agnostic RootStack component (Native implementation)
 * Wraps Expo Router Stack for consistent root layout interface
 */
// oxlint-disable-next-line no-unused-vars
export function RootStack({ children }: RootStackProps): JSX.Element {
  return <Stack />;
}
