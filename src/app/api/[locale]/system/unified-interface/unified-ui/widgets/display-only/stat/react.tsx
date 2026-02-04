"use client";

import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Minus, TrendingDown, TrendingUp } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { NumberWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { Icon } from "../../form-fields/icon-field/icons";
import { formatStatValue } from "./shared";
import type { StatWidgetConfig } from "./types";

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
 * Stat Widget - Displays numeric statistics with labels and optional formatting
 *
 * Renders a single statistic in a card with automatic number formatting, trend indicators,
 * and icon support. Automatically translates label text from UI config.
 *
 * Features:
 * - Locale-aware number formatting (percentage, currency, compact notation)
 * - Automatic icon detection from field key or explicit configuration
 * - Trend indicators with color-coded arrows (up/down/neutral)
 * - Multiple size variants (sm, md, lg)
 * - Color variants for semantic meaning (success, warning, danger, etc.)
 *
 * UI Config Options:
 * - label: Label text for the statistic (TKey - translated via context.t)
 * - format: "number" | "percentage" | "currency" | "compact" - Value formatting style
 * - icon: Icon name from iconMap or auto-inferred from field key
 * - variant: "default" | "success" | "warning" | "danger" | "info" | "muted"
 * - trend: "up" | "down" | "neutral" - Optional trend indicator
 * - trendValue: Number to show as trend percentage (e.g., 12.5)
 * - size: "sm" | "md" | "lg" (default: "md") - Card size variant
 *
 * Data Format:
 * - number: Numeric value to display (required for proper rendering)
 * - Non-numeric values show "—" placeholder
 *
 * Icon Mapping:
 * Automatically maps icon names or field keys to components:
 * - users/mail/email/card/payment/stripe/chart/stats/activity
 * - check/verified/success/error/unverified/time/clock/star
 * - rate/growth/retention/conversion
 *
 * Format Examples:
 * - percentage: 0.125 → "12.5%"
 * - currency: 1234 → "$1,234"
 * - compact: 1500000 → "1.5M"
 * - number: 1234.56 → "1,234.56"
 *
 * @param value - Numeric statistic value
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function StatWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  StatWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const {
    label: labelKey,
    format,
    icon,
    variant = "default",
    trend,
    trendValue,
    size = "md",
    padding,
    valueSize,
    labelSize,
    iconSize,
    iconSpacing,
    trendSize,
    trendIconSize,
    trendGap,
    trendSpacing,
    labelSpacing,
    className,
  } = field;

  // Translate label from UI config - no assertion needed
  const label = labelKey ? t(labelKey) : "—";

  // Get classes from config (no hardcoding!)
  const paddingClass = getSpacingClassName("padding", padding);
  const valueSizeClass = getTextSizeClassName(valueSize);
  const labelSizeClass = getTextSizeClassName(labelSize);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);
  const trendSizeClass = getTextSizeClassName(trendSize);
  const trendIconSizeClass = getIconSizeClassName(trendIconSize);
  const trendGapClass = getSpacingClassName("gap", trendGap);
  const trendSpacingClass = getSpacingClassName("margin", trendSpacing);
  const labelSpacingClass = getSpacingClassName("margin", labelSpacing);

  // Size defaults based on size prop
  const sizeDefault = sizeDefaults[size] || sizeDefaults.md;

  // Handle non-numeric values
  if (typeof field.value !== "number") {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent
          className={cn(
            "flex flex-col items-center justify-center text-center min-h-[80px]",
            paddingClass || sizeDefault.padding,
          )}
        >
          <Span className="text-muted-foreground">—</Span>
          <Span
            className={cn(
              "text-muted-foreground",
              labelSizeClass || sizeDefault.label,
              labelSpacingClass || "mt-1",
            )}
          >
            {label}
          </Span>
        </CardContent>
      </Card>
    );
  }

  // Format the value
  const formattedValue = formatStatValue(field.value, format, locale);

  // Get variant class
  const variantClass =
    variantClasses[variant as StatVariant] || variantClasses.default;

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
          paddingClass || sizeDefault.padding,
        )}
      >
        {/* Icon (optional) */}
        {icon && (
          <Icon
            icon={icon}
            className={cn(
              "text-muted-foreground",
              iconSizeClass || sizeDefault.icon,
              iconSpacingClass || "mb-2",
            )}
          />
        )}

        {/* Value */}
        <Span
          className={cn(
            "font-bold tabular-nums",
            valueSizeClass || sizeDefault.value,
            variantClass,
          )}
        >
          {formattedValue}
        </Span>

        {/* Trend indicator (optional) */}
        {TrendIcon && trendValue !== undefined && (
          <Span
            className={cn(
              "flex items-center",
              trendSizeClass || "text-xs",
              trendGapClass || "gap-0.5",
              trendSpacingClass || "mt-1",
              trendColorClass,
            )}
          >
            <TrendIcon className={trendIconSizeClass || "h-3 w-3"} />
            {Math.abs(trendValue)}%
          </Span>
        )}

        {/* Label */}
        <Span
          className={cn(
            "text-muted-foreground leading-tight",
            labelSizeClass || sizeDefault.label,
            labelSpacingClass || "mt-1.5",
          )}
        >
          {label}
        </Span>
      </CardContent>
    </Card>
  );
}

StatWidget.displayName = "StatWidget";

export default StatWidget;

const sizeDefaults = {
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
} as const;
