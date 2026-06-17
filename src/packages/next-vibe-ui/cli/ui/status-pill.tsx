import { Text } from "ink";
import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import type {
  StatusPillProps,
  StatusPillVariant,
} from "../../web/ui/status-pill";

export type {
  StatusPillProps,
  StatusPillVariant,
} from "../../web/ui/status-pill";

const VARIANT_COLOR: Record<StatusPillVariant, string | undefined> = {
  default: "cyan",
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  muted: undefined,
};

export function StatusPill({
  status,
  variant = "default",
  label,
}: StatusPillProps): JSX.Element {
  const isMcp = useIsMcp();
  const display = label ?? status;

  if (isMcp) {
    return <Text>{display}</Text>;
  }

  const color = VARIANT_COLOR[variant];
  const dimColor = variant === "muted";

  return (
    <Text color={color} dimColor={dimColor}>
      [{display}]
    </Text>
  );
}
StatusPill.displayName = "StatusPill";
