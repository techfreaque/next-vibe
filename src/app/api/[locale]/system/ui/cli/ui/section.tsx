import { Box } from "ink";
import { parseClassesToInkProps } from "next-vibe/ui/cli/utils/tailwind-to-ink";
import type { SectionProps } from "next-vibe/ui/web/ui/section";
import * as React from "react";

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
