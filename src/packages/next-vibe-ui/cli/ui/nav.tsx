import { Box } from "ink";
import * as React from "react";

import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

import type { NavProps } from "../../web/ui/nav";

export function Nav({
  className,
  children,
}: NavProps): React.JSX.Element | null {
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
