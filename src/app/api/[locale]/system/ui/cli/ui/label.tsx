import { Text } from "ink";
import type { JSX } from "react";

import type { LabelRootProps } from "../../web/ui/label";

export type { LabelRootProps } from "../../web/ui/label";

const COLON = "\u003A";
const SPACE = "\u0020";

export function Label({ children }: LabelRootProps): JSX.Element {
  return (
    <Text bold>
      {children}
      {COLON}
      {SPACE}
    </Text>
  );
}
Label.displayName = "Label";
