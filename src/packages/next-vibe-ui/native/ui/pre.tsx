import type { JSX } from "react";
import { Text } from "react-native";
import type { TextProps } from "react-native";

export function Pre(props: TextProps): JSX.Element {
  return <Text {...props} style={[{ fontFamily: "monospace" }, props.style]} />;
}

