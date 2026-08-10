import { Box } from "ink";
import * as React from "react";

import type { MainProps } from "../../web/components/main";
import { parseClassesToInkProps } from "./tailwind-to-ink";

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
