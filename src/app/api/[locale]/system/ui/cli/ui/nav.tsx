import { Box } from "ink";
import { parseClassesToInkProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { NavProps } from "next-vibe/ui/web/ui/nav";
import * as React from "react";

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
