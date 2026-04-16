import * as React from "react";
import { Box } from "ink";

import type { DivProps, DivRefObject } from "../../web/ui/div";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

// forwardRef is a no-op in CLI — terminals have no DOM refs.
// We accept the ref parameter to satisfy the type contract but never use it.
export const Div = React.forwardRef<DivRefObject, DivProps>(
  ({ className, children }: DivProps, ref: React.Ref<DivRefObject>) => {
    void ref; // intentionally unused — no DOM in terminal
    const { box, hidden } = parseClassesToInkProps(className);

    if (hidden) {
      return null;
    }

    return <Box {...box}>{children}</Box>;
  },
);

Div.displayName = "Div";
