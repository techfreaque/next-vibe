/**
 * Stat Widget - Ink implementation
 * Handles STAT widget type for displaying statistics
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import type { StatWidgetConfig } from "./types";

/**
 * Stat Widget - Ink functional component
 *
 * Displays a statistic with label and optional change indicator.
 */
export function StatWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StatsWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  StatWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const { label: labelKey } = field;
  const { t } = context;

  const label = labelKey ? t(labelKey) : undefined;

  // Extract value and change - value comes from Zod schema so it's validated
  // NumberWidgetSchema allows number or object with value/count/change/trend
  let displayValue: string;
  let change: number | undefined;
  let trend: "up" | "down" | undefined;

  // Use field.value directly - schema guarantees the type
  displayValue = field.value ?? field.value.count ?? field.value;
  change = field.value.change;
  trend = field.value.trend;

  // Determine color based on trend
  const trendColor =
    trend === "up" ? "green" : trend === "down" ? "red" : undefined;
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : undefined;

  return (
    <Box flexDirection="column" marginY={1}>
      {label && <Text dimColor>{label}</Text>}
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
