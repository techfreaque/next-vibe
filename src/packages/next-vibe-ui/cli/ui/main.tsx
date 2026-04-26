import * as React from "react";
import { Box } from "ink";

import type { MainProps } from "../../web/ui/main";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

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
