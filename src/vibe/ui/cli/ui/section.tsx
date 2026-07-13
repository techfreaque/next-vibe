import { Box } from "ink";
import * as React from "react";

import type { SectionProps } from "../../web/ui/section";
import { parseClassesToInkProps } from "./tailwind-to-ink";

export function Section({
  className,
  children,
}: SectionProps): React.JSX.Element | null {
  const { box, hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  return (
    <Box flexDirection="column" {...box}>
      {children}
    </Box>
  );
}
