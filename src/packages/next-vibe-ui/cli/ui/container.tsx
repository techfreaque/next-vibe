import * as React from "react";
import { Box } from "ink";

import type { ContainerProps } from "../../web/ui/container";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

export function Container({
  className,
  children,
}: ContainerProps): React.JSX.Element | null {
  const { box, hidden } = parseClassesToInkProps(className);

  if (hidden) {
    return null;
  }

  return (
    <Box flexDirection="column" paddingLeft={1} paddingRight={1} {...box}>
      {children}
    </Box>
  );
}
