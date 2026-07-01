import { Box } from "ink";
import { parseClassesToInkProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { MainProps } from "next-vibe/ui/web/ui/main";
import * as React from "react";

export function Main({
  className,
  children,
}: MainProps): React.JSX.Element | null {
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
