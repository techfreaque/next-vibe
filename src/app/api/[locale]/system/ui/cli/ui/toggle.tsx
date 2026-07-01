import { Text } from "ink";
import type {
  ToggleRootProps,
  ToggleSize,
  ToggleVariant,
} from "next-vibe/ui/web/ui/toggle";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type {
  ToggleRootProps,
  ToggleSize,
  ToggleVariant,
} from "next-vibe/ui/web/ui/toggle";
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
