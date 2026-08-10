import { Box, Text } from "ink";
import * as React from "react";

import type { DivProps, DivRefObject } from "../../web/ui/div";
import { parseClassesToInkProps } from "./tailwind-to-ink";
import { TextStyleProvider } from "./text-style-context";

/**
 * Wrap bare string/number children in <Text> so Ink doesn't crash.
 * In HTML, <div> can contain bare text. In Ink, <Box> cannot.
 */
function sanitizeChildren(children: React.ReactNode): React.ReactNode {
  if (children === null || children === undefined) {
    return children;
  }

  // Single bare string/number → wrap
  if (typeof children === "string" || typeof children === "number") {
    return <Text>{children}</Text>;
  }

  // Array of children → wrap any bare strings
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === "string" || typeof child === "number") {
        return <Text key={i}>{child}</Text>;
      }
      return child;
    });
  }

  return children;
}

// forwardRef is a no-op in CLI - terminals have no DOM refs.
// We accept the ref parameter to satisfy the type contract but never use it.
export const Div = React.forwardRef<DivRefObject, DivProps>(
  ({ className, children }: DivProps, ref: React.Ref<DivRefObject>) => {
    void ref; // intentionally unused - no DOM in terminal
    const { box, text, hidden } = parseClassesToInkProps(className);

    if (hidden) {
      return null;
    }

    // Default to column layout - matches web div block-level stacking.
    // When `flex` class is present, parser sets flexDirection to "row"
    // (matching CSS flex default), which overrides this via spread.
    const boxProps = { flexDirection: "column" as const, ...box };

    // An Ink Box cannot carry text style, so `text-*` / `font-bold` on a Div
    // would otherwise be dropped. Publish it instead: Span and the icons pick it
    // up and merge their own on top, reproducing CSS inheritance.
    return (
      <Box {...boxProps}>
        <TextStyleProvider style={text}>
          {sanitizeChildren(children)}
        </TextStyleProvider>
      </Box>
    );
  },
);

Div.displayName = "Div";
