import { Text } from "ink";
import type { BrProps } from "next-vibe/ui/web/ui/br";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Br(_props: BrProps): React.JSX.Element {
  return <Text>{"\n"}</Text>;
}
