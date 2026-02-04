/**
 * Metric Card Widget - Ink implementation
 * Handles METRIC_CARD widget type for metric displays
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { MetricCardWidgetConfig } from "./types";

/**
 * Metric Card Widget - Ink functional component
 *
 * Displays a metric with label, value, and optional change indicator.
 */
export function MetricCardWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  MetricCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { title: titleKey, change, trend } = field;

  const title = titleKey ? t(titleKey) : undefined;

  // Extract metric data from config (not from field.value)
  const displayValue = String(field.value ?? "0");

  const trendColor =
    trend === "up" ? "green" : trend === "down" ? "red" : undefined;
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : undefined;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      paddingX={2}
      paddingY={1}
      marginY={1}
    >
      {title && <Text bold>{title}</Text>}
      <Box>
        <Text bold color="blue">
          {displayValue}
        </Text>
        {change !== undefined && (
          <Text color={trendColor}>
            {" "}
            {trendIcon} {change > 0 ? "+" : ""}
            {change}%
          </Text>
        )}
      </Box>
    </Box>
  );
}
