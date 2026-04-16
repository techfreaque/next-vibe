import * as React from "react";
import { Text } from "ink";

import type { StrongProps } from "../../web/ui/strong";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

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
