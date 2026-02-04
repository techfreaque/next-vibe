/**
 * Status Indicator Widget - CLI Ink implementation
 * Handles STATUS_INDICATOR widget type for interactive terminal UI
 */

import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { FieldUsageConfig } from "../../_shared/types";
import type {
  StatusIndicatorWidgetConfig,
  StatusIndicatorWidgetSchema,
} from "./types";

/**
 * Maps status to Ink text color
 */
function getStatusColor(
  status: "success" | "warning" | "error" | "info" | "pending",
): "green" | "yellow" | "red" | "blue" | "gray" {
  switch (status) {
    case "success":
      return "green";
    case "warning":
      return "yellow";
    case "error":
      return "red";
    case "info":
      return "blue";
    case "pending":
      return "gray";
    default:
      return "gray";
  }
}

/**
 * Status Indicator Widget - Ink functional component
 *
 * Displays status with color-coded text in interactive terminal UI.
 * Mirrors the React StatusIndicatorWidget component exactly.
 */
export function StatusIndicatorWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StatusIndicatorWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  StatusIndicatorWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { status, label } = field;

  const color = getStatusColor(status);

  // Use label if provided, otherwise use the value itself
  const displayText = label
    ? t(label)
    : typeof field.value === "string"
      ? field.value
      : status;

  return <Text color={color}>{displayText}</Text>;
}
