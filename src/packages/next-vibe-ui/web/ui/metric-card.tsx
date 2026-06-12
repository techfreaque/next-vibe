import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

export type MetricCardVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export type MetricCardTrend = "up" | "down" | "neutral";

export type MetricCardFormat = "number" | "percentage" | "currency" | "compact";

export type MetricCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  variant?: MetricCardVariant;
  trend?: MetricCardTrend;
  trendValue?: string;
  format?: MetricCardFormat;
} & StyleType;

const variantClasses: Record<MetricCardVariant, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
};

const trendIcons: Record<MetricCardTrend, string> = {
  up: "\u25B2",
  down: "\u25BC",
  neutral: "\u25CF",
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
    case "number":
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
  style,
}: MetricCardProps): React.JSX.Element {
  const formatted = formatValue(value, format);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border bg-card px-4 py-3 min-w-0",
        className,
      )}
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground truncate">{label}</span>
        {icon ? (
          <div className="flex-shrink-0 text-muted-foreground/50">{icon}</div>
        ) : null}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            variantClasses[variant],
          )}
        >
          {formatted}
        </span>
        {trend ? (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              trendColors[trend],
            )}
          >
            {trendIcons[trend]}
            {trendValue ? ` ${trendValue}` : ""}
          </span>
        ) : null}
      </div>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </div>
  );
}
MetricCard.displayName = "MetricCard";
