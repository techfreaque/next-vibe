import { Box, Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type {
  ProgressBlockProps,
  ProgressBlockVariant,
} from "../../web/ui/progress-block";

export type {
  ProgressBlockProps,
  ProgressBlockVariant,
} from "../../web/ui/progress-block";

const VARIANT_COLOR: Record<ProgressBlockVariant, string> = {
  default: "cyan",
  success: "green",
  warning: "yellow",
  danger: "red",
};

const BAR_WIDTH = 20;
const FILLED_CHAR = "\u2588";
const EMPTY_CHAR = "\u2591";

export function ProgressBlock({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "default",
}: ProgressBlockProps): JSX.Element {
  const isMcp = useIsMcp();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const pctStr = `${Math.round(pct)}%`;

  if (isMcp) {
    return (
      <Text>
        {label ? `${label}: ` : ""}
        {pctStr}
      </Text>
    );
  }

  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const color = VARIANT_COLOR[variant];

  return (
    <Box gap={1}>
      <Text>
        <Text color={color}>{FILLED_CHAR.repeat(filled)}</Text>
        <Text dimColor>{EMPTY_CHAR.repeat(empty)}</Text>
      </Text>
      {showPercentage ? <Text>{pctStr}</Text> : null}
      {label ? <Text dimColor>{label}</Text> : null}
    </Box>
  );
}
ProgressBlock.displayName = "ProgressBlock";
