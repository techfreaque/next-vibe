import { styled } from "nativewind";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { View } from "react-native";

import type {
  MetricCardFormat,
  MetricCardProps,
  MetricCardTrend,
  MetricCardVariant,
} from "../../web/ui/metric-card";
import { Text } from "./text";

export type {
  MetricCardFormat,
  MetricCardProps,
  MetricCardTrend,
  MetricCardVariant,
} from "../../web/ui/metric-card";

const StyledView = styled(View, { className: "style" });

const variantClasses: Record<MetricCardVariant, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
  violet: "text-violet-600",
};

const trendColors: Record<MetricCardTrend, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

function formatValue(
  value: string | number,
  format?: MetricCardFormat,
): string {
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
  icon,
  variant = "default",
  trend,
  trendValue,
  format,
  className,
}: MetricCardProps): React.JSX.Element {
  const formatted = formatValue(value, format);

  return (
    <StyledView
      className={cn(
        "flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <StyledView className="flex-row items-center justify-between gap-2">
        <Text className="text-xs text-muted-foreground">{label}</Text>
        {icon ? <StyledView className="opacity-50">{icon}</StyledView> : null}
      </StyledView>
      <StyledView className="flex-row items-baseline gap-2">
        <Text className={cn("text-2xl font-bold", variantClasses[variant])}>
          {formatted}
        </Text>
        {trend ? (
          <Text className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === "up" ? "\u25B2" : trend === "down" ? "\u25BC" : "\u25CF"}
            {trendValue ? ` ${trendValue}` : ""}
          </Text>
        ) : null}
      </StyledView>
      {description ? (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      ) : null}
    </StyledView>
  );
}
MetricCard.displayName = "MetricCard";
