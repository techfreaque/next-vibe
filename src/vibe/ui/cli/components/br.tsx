import { Text } from "ink";
import * as React from "react";

import type { BrProps } from "../../web/components/br";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Br(_props: BrProps): React.JSX.Element {
  return <Text>{"\n"}</Text>;
}
