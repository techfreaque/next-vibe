import { Text } from "ink";
import type { JSX } from "react";

import { cva } from "class-variance-authority";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { ToggleRootProps } from "../../web/components/toggle";

export type {
  ToggleRootProps,
  ToggleSize,
  ToggleVariant,
} from "../../web/components/toggle";

export const toggleVariants = cva("");
export const toggleTextVariants = cva("");

// CLI: show pressed state in brackets. MCP: plain on/off text.
export function Toggle({ pressed, children }: ToggleRootProps): JSX.Element {
  const isMcp = useIsMcp();
  const stateLabel = pressed ? "on" : "off";

  if (isMcp) {
    return (
      <Text>
        {stateLabel}
        {children ? ` ${String(children)}` : ""}
      </Text>
    );
  }

  return (
    <Text>
      [{stateLabel}]{children ? ` ${String(children)}` : ""}
    </Text>
  );
}
