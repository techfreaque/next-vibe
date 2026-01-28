/**
 * Stat Widget - Ink implementation
 * Handles STAT widget type for displaying statistics
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { NumberWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import { formatStatValue } from "./shared";
import type { StatWidgetConfig } from "./types";

/**
 * Stat Widget - Ink functional component
 *
 * Displays a statistic with label and optional change indicator.
 */
export function StatWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  StatWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const { label: labelKey, format, trend, trendValue } = field;
  const { t } = context;

  const label = labelKey ? t(labelKey) : undefined;

  // Handle non-numeric values
  if (typeof field.value !== "number") {
    return (
      <Box flexDirection="column" marginY={1}>
        {label && <Text dimColor>{label}</Text>}
        <Text dimColor>{field.value}</Text>
      </Box>
    );
  }

  // Format the value using shared logic
  const displayValue = formatStatValue(field.value, format, context.locale);

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
        {trend && trendValue !== undefined && (
          <Text color={trendColor}>
            {" "}
            {trendIcon} {Math.abs(trendValue)}%
          </Text>
        )}
      </Box>
    </Box>
  );
}
