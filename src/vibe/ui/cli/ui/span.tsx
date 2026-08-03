import { Text } from "ink";
import * as React from "react";

import type { SpanProps, SpanRefObject } from "../../web/ui/span";
import { parseClassesToInkProps } from "./tailwind-to-ink";
import { TextStyleProvider, useResolvedTextStyle } from "./text-style-context";

// forwardRef is a no-op in CLI - terminals have no DOM refs.
export const Span = React.forwardRef<SpanRefObject, SpanProps>(
  ({ className, children }: SpanProps, ref: React.Ref<SpanRefObject>) => {
    void ref; // intentionally unused - no DOM in terminal
    const { text, hidden } = parseClassesToInkProps(className);
    // Own classes merged over whatever an ancestor Div/Span published; empty on
    // MCP so agents get plain text. See text-style-context.tsx.
    const style = useResolvedTextStyle(text);

    if (hidden) {
      return null;
    }

    // Also publish downward: a nested Span or icon inherits this Span's style,
    // so `<Span class="font-bold"><Icon/><Span class="text-blue-500">x</Span></Span>`
    // renders bold icon + bold-blue text, matching chalk.bold(chalk.blue(...)).
    return (
      <Text {...style}>
        <TextStyleProvider style={text}>{children}</TextStyleProvider>
      </Text>
    );
  },
);

Span.displayName = "Span";
