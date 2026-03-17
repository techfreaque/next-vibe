/**
 * Alert Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { AlertWidgetConfig, AlertWidgetSchema } from "./types";

export function AlertWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        AlertWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        AlertWidgetConfig<TKey, AlertWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const t = useInkWidgetTranslation<TEndpoint>();
  const { content, variant = "default" } = field;

  const message = !field.value
    ? content
      ? t(content)
      : ""
    : typeof field.value === "string"
      ? // oxlint-disable-next-line typescript/no-explicit-any
        t(field.value as any)
      : field.value;

  // Determine color based on variant
  let color: string;
  let icon: string;

  switch (variant) {
    case "destructive":
      color = "red";
      icon = "❌";
      break;
    case "success":
      color = "green";
      icon = "✓";
      break;
    case "warning":
      color = "yellow";
      icon = "⚠";
      break;
    default:
      color = "blue";
      icon = "ℹ";
  }

  return (
    <Box borderStyle="round" borderColor={color} paddingX={1} paddingY={1}>
      <Text color={color}>
        {icon} {message}
      </Text>
    </Box>
  );
}
