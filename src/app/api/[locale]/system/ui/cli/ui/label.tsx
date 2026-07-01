import { Text } from "ink";
import type { LabelRootProps } from "next-vibe/ui/web/ui/label";
import type { JSX } from "react";

export type { LabelRootProps } from "next-vibe/ui/web/ui/label";

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
