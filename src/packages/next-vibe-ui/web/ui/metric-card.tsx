import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

export type MetricCardVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "violet";

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
  colored?: boolean;
} & StyleType;

const variantClasses: Record<MetricCardVariant, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
  violet: "text-violet-600 dark:text-violet-300",
};

const coloredBgClasses: Record<MetricCardVariant, string> = {
  default: "bg-card border-border",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  danger: "bg-destructive/10 border-destructive/30",
  info: "bg-info/10 border-info/30",
  muted: "bg-muted/30 border-border",
  violet:
    "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
};

const coloredIconClasses: Record<MetricCardVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
  violet: "text-violet-600 dark:text-violet-300",
};

const coloredDescClasses: Record<MetricCardVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success/70",
  warning: "text-warning/70",
  danger: "text-destructive/70",
  info: "text-info/70",
  muted: "text-muted-foreground/70",
  violet: "text-violet-500 dark:text-violet-400",
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
  colored = false,
  className,
  style,
}: MetricCardProps): React.JSX.Element {
  const formatted = formatValue(value, format);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border px-4 py-3 min-w-0",
        colored ? coloredBgClasses[variant] : "bg-card",
        className,
      )}
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-medium truncate",
            colored ? coloredIconClasses[variant] : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        {icon ? (
          <div
            className={cn(
              "flex-shrink-0",
              colored
                ? coloredIconClasses[variant]
                : "text-muted-foreground/50",
            )}
          >
            {icon}
          </div>
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
        <span
          className={cn(
            "text-xs",
            colored ? coloredDescClasses[variant] : "text-muted-foreground",
          )}
        >
          {description}
        </span>
      ) : null}
    </div>
  );
}
MetricCard.displayName = "MetricCard";
