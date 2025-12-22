"use client";

import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  Minus,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { ComponentType, JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

// Icon mapping for common stat types
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  users: Users,
  mail: Mail,
  email: Mail,
  card: CreditCard,
  payment: CreditCard,
  stripe: CreditCard,
  chart: BarChart3,
  stats: BarChart3,
  activity: Activity,
  check: CheckCircle,
  verified: CheckCircle,
  success: CheckCircle,
  error: XCircle,
  unverified: XCircle,
  time: Clock,
  clock: Clock,
  star: Star,
  rate: Activity,
  growth: TrendingUp,
  retention: Activity,
  conversion: Activity,
};

// Color variants for different stat types
type StatVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

const variantClasses: Record<StatVariant, string> = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
  muted: "text-muted-foreground",
};

/**
 * Format a numeric value based on format type
 */
function formatStatValue(
  value: number,
  format: string | undefined,
  locale: string,
): string {
  if (format === "percentage" || format === "percent") {
    // Assume value is 0-1 range, convert to percentage
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (format === "currency") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (format === "compact") {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  }
  // Default number formatting with locale
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Get an icon component based on icon name or field key
 */
function getIconComponent(
  iconName: string | undefined,
  fieldKey: string,
): ComponentType<{ className?: string }> | null {
  if (iconName && iconMap[iconName.toLowerCase()]) {
    return iconMap[iconName.toLowerCase()];
  }

  // Try to infer from field key
  const keyLower = fieldKey.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (keyLower.includes(key)) {
      return icon;
    }
  }

  return null;
}

/**
 * Displays a single statistic with label, value, and optional formatting.
 * Designed for numeric values from API responses with labels from definitions.
 *
 * UI Config options:
 * - label: Translation key for the stat label
 * - format: "number" | "percentage" | "currency" | "compact"
 * - icon: Icon name or auto-inferred from field key
 * - variant: "default" | "success" | "warning" | "danger" | "info" | "muted"
 * - trend: "up" | "down" | "neutral" (optional trend indicator)
 * - trendValue: Number to show as trend percentage
 * - size: "sm" | "md" | "lg" (default: "md")
 */
export function StatWidget<TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.STAT, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const {
    label: labelKey,
    format,
    icon,
    variant = "default",
    trend,
    trendValue,
    size = "md",
  } = field.ui;

  // Get label from translation
  const label = labelKey ? t(labelKey as TranslationKey) : "—";

  // Handle non-numeric values
  if (typeof value !== "number") {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[80px]">
          <Span className="text-muted-foreground">—</Span>
          <Span className="text-xs text-muted-foreground mt-1">{label}</Span>
        </CardContent>
      </Card>
    );
  }

  // Format the value
  const formattedValue = formatStatValue(value, format, context.locale);

  // Get icon component (use icon from config or infer from label)
  const IconComponent = getIconComponent(icon, labelKey || "");

  // Get variant class
  const variantClass =
    variantClasses[variant as StatVariant] || variantClasses.default;

  // Size classes
  const sizeClasses = {
    sm: { value: "text-lg", label: "text-xs", icon: "h-4 w-4", padding: "p-3" },
    md: {
      value: "text-2xl",
      label: "text-xs",
      icon: "h-5 w-5",
      padding: "p-4",
    },
    lg: {
      value: "text-3xl",
      label: "text-sm",
      icon: "h-6 w-6",
      padding: "p-5",
    },
  };
  const sizeClass =
    sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

  // Trend icon and color
  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
        ? TrendingDown
        : trend === "neutral"
          ? Minus
          : null;
  const trendColorClass =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card className={cn("h-full hover:shadow-md transition-shadow", className)}>
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center text-center min-h-[100px]",
          sizeClass.padding,
        )}
      >
        {/* Icon (optional) */}
        {IconComponent && (
          <IconComponent
            className={cn(sizeClass.icon, "text-muted-foreground mb-2")}
          />
        )}

        {/* Value */}
        <Span
          className={cn(
            sizeClass.value,
            "font-bold tabular-nums",
            variantClass,
          )}
        >
          {formattedValue}
        </Span>

        {/* Trend indicator (optional) */}
        {TrendIcon && trendValue !== undefined && (
          <Span
            className={cn(
              "flex items-center gap-0.5 text-xs mt-1",
              trendColorClass,
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trendValue)}%
          </Span>
        )}

        {/* Label */}
        <Span
          className={cn(
            sizeClass.label,
            "text-muted-foreground mt-1.5 leading-tight",
          )}
        >
          {label}
        </Span>
      </CardContent>
    </Card>
  );
}

StatWidget.displayName = "StatWidget";
