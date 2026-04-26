import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  ToggleRootProps,
  ToggleVariant,
  ToggleSize,
} from "../../web/ui/toggle";

export type {
  ToggleRootProps,
  ToggleVariant,
  ToggleSize,
} from "../../web/ui/toggle";
import { cva } from "class-variance-authority";

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
