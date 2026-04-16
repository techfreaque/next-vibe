import * as React from "react";
import { Text } from "ink";

import type { SpanProps, SpanRefObject } from "../../web/ui/span";
import { parseClassesToInkProps } from "@/packages/next-vibe-ui/cli/utils/tailwind-to-ink";

// forwardRef is a no-op in CLI — terminals have no DOM refs.
export const Span = React.forwardRef<SpanRefObject, SpanProps>(
  ({ className, children }: SpanProps, ref: React.Ref<SpanRefObject>) => {
    void ref; // intentionally unused — no DOM in terminal
    const { text, hidden } = parseClassesToInkProps(className);

    if (hidden) {
      return null;
    }

    return <Text {...text}>{children}</Text>;
  },
);

Span.displayName = "Span";
