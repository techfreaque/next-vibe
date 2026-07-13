import { Box, Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type {
  MetricCardProps,
  MetricCardTrend,
  MetricCardVariant,
} from "../../web/ui/metric-card";

export type {
  MetricCardFormat,
  MetricCardProps,
  MetricCardTrend,
  MetricCardVariant,
} from "../../web/ui/metric-card";

const VARIANT_COLOR: Record<MetricCardVariant, string | undefined> = {
  default: undefined,
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  muted: undefined,
  violet: "magenta",
};

const TREND_SYMBOL: Record<MetricCardTrend, string> = {
  up: "\u25B2",
  down: "\u25BC",
  neutral: "\u25CF",
};

function formatValue(value: string | number, format?: string): string {
  if (typeof value === "string") {
    return value;
  }
  switch (format) {
    case "percentage":
      return `${value}%`;
    case "currency":
      return `$${value.toLocaleString()}`;
    case "compact": {
      if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
      }
      if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    default:
      return value.toLocaleString();
  }
}

export function MetricCard({
  label,
  value,
  description,
  variant = "default",
  trend,
  trendValue,
  format,
}: MetricCardProps): JSX.Element {
  const isMcp = useIsMcp();
  const formatted = formatValue(value, format);
  const color = VARIANT_COLOR[variant];
  const dimVariant = variant === "muted";

  if (isMcp) {
    const trendStr =
      trend && trendValue ? ` (${TREND_SYMBOL[trend]} ${trendValue})` : "";
    const descStr = description ? ` — ${description}` : "";
    return (
      <Text>
        {label}: {formatted}
        {trendStr}
        {descStr}
      </Text>
    );
  }

  return (
    <Box flexDirection="column">
      <Box gap={1}>
        <Text dimColor>{label}:</Text>
        <Text bold={!dimVariant} dimColor={dimVariant} color={color}>
          {formatted}
        </Text>
        {trend ? (
          <Text
            color={
              trend === "up" ? "green" : trend === "down" ? "red" : undefined
            }
            dimColor={trend === "neutral"}
          >
            {TREND_SYMBOL[trend]}
            {trendValue ? ` ${trendValue}` : ""}
          </Text>
        ) : null}
      </Box>
      {description ? <Text dimColor> {description}</Text> : null}
    </Box>
  );
}
MetricCard.displayName = "MetricCard";
