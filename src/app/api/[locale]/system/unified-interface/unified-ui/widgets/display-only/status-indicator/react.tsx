/**
 * Status Indicator Widget - Platform-agnostic React implementation
 * Displays status with colored indicators
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";

import type { FieldUsageConfig } from "../../_shared/types";
import type {
  StatusIndicatorWidgetConfig,
  StatusIndicatorWidgetSchema,
} from "./types";

/**
 * Maps status to Badge variant
 */
function mapStatusToBadgeVariant(
  status: "success" | "warning" | "error" | "info" | "pending",
): "default" | "secondary" | "destructive" | "outline" | "notification" {
  switch (status) {
    case "success":
      return "default";
    case "warning":
      return "notification";
    case "error":
      return "destructive";
    case "info":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "default";
  }
}

/**
 * Status Indicator Widget
 *
 * Displays a status badge with semantic color coding.
 *
 * UI Config Options:
 * - status: "success" | "warning" | "error" | "info" | "pending"
 * - label: Optional translation key for status text
 *
 * Status Variants:
 * - success → green badge
 * - warning → yellow/orange badge
 * - error → red badge
 * - info → blue/gray badge
 * - pending → outlined badge
 */
export function StatusIndicatorWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StatusIndicatorWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  StatusIndicatorWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const { status, label, className } = field;

  const badgeVariant = mapStatusToBadgeVariant(status);

  // Use label if provided, otherwise use the value itself
  const displayText = label
    ? context.t(label)
    : typeof field.value === "string"
      ? field.value
      : status;

  return (
    <Badge variant={badgeVariant} className={className}>
      {displayText}
    </Badge>
  );
}

StatusIndicatorWidget.displayName = "StatusIndicatorWidget";

export default StatusIndicatorWidget;
