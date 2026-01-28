/**
 * Metric Card Widget - Ink implementation
 * Handles METRIC_CARD widget type for metric displays
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

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
  TChildren extends Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  >,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  MetricCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { title: titleKey } = field;
  const { t } = context;

  const title = titleKey ? t(titleKey) : undefined;
  const description = field.description ? t(field.description) : undefined;

  // Extract metric data
  let displayValue: string;
  let change: number | undefined;
  let trend: "up" | "down" | undefined;

  if (field.value !== null) {
    displayValue = String(
      field.value ?? field.value.metric ?? field.value.count ?? "0",
    );
    change =
      typeof field.value.change === "number" ? field.value.change : undefined;
    trend =
      field.value.trend === "up" || field.value.trend === "down"
        ? field.value.trend
        : undefined;
  } else {
    displayValue = String(field.value ?? "0");
  }

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
      {description && <Text dimColor>{description}</Text>}
    </Box>
  );
}
