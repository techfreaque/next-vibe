import * as React from "react";
import { Text } from "react-native";

/**
 * Platform-agnostic Br component for native
 * On native, this renders a newline character in a Text component
 * Note: This should typically be used within Text components for proper rendering
 */
export function Br(): React.JSX.Element {
  return <Text>{"\n"}</Text>;
}
