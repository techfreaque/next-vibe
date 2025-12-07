import * as React from "react";
import { Text } from "react-native";

import type { BrProps } from "@/packages/next-vibe-ui/web/ui/br";

/**
 * Platform-agnostic Br component for native
 * On native, this renders a newline character in a Text component
 * Note: This should typically be used within Text components for proper rendering
 */
export function Br(_props: BrProps): React.JSX.Element {
  return <Text>{"\n"}</Text>;
}
