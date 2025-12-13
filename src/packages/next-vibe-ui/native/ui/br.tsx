import * as React from "react";
import { Text } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Type available for documentation
import type { BrProps } from "@/packages/next-vibe-ui/web/ui/br";

/**
 * Platform-agnostic Br component for native
 * On native, this renders a newline character in a Text component
 * Note: This should typically be used within Text components for proper rendering
 */
export function Br(): React.JSX.Element {
  return <Text>{"\n"}</Text>;
}
