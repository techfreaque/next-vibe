import { Text } from "ink";
import * as React from "react";

import type { StrongProps } from "../../web/components/strong";
import { parseClassesToInkProps } from "./tailwind-to-ink";

export function Strong({
  className,
  children,
}: StrongProps): React.JSX.Element | null {
  const { text, hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  // Strong always renders bold; merge any className-derived text props on top
  return (
    <Text bold {...text}>
      {children}
    </Text>
  );
}
