import { Box } from "ink";
import { parseClassesToInkProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { ContainerProps } from "next-vibe/ui/web/ui/container";
import * as React from "react";

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
