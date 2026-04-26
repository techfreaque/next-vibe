import * as React from "react";
import { Box } from "ink";

import type { NavProps } from "../../web/ui/nav";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

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
