import { Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import * as React from "react";

import type { TitleProps } from "../../web/ui/title";
import { parseClassesToInkProps } from "./tailwind-to-ink";

export function Title({
  children,
  className,
  level,
}: TitleProps): React.JSX.Element | null {
  const { text, hidden } = parseClassesToInkProps(className);
  const isMcp = useIsMcp();

  if (hidden) {
    return null;
  }

  // In MCP mode: just bold text, no underline decoration
  if (isMcp) {
    return (
      <Text bold {...text}>
        {children}
      </Text>
    );
  }

  // CLI mode: h1/h2 get bold+underline for prominence; h3-h6 just bold
  const underline = level <= 2;

  return (
    <Text bold underline={underline} {...text}>
      {children}
    </Text>
  );
}
