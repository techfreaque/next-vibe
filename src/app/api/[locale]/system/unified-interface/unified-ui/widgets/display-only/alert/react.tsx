"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { useWidgetTranslation } from "../../_shared/use-widget-context";
import type { AlertWidgetConfig, AlertWidgetSchema } from "./types";

/**
 * Displays alert messages with configurable variants.
 * Value should be a translation key string.
 */
export function AlertWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        AlertWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        AlertWidgetConfig<TKey, AlertWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element | null {
  const t = useWidgetTranslation();
  const { field } = props;
  const { variant = "default", className, content: hardcodedContent } = field;

  let content: string | undefined;
  if (field.value) {
    content = t(field.value);
  } else if (hardcodedContent) {
    content = t(hardcodedContent);
  }

  if (!content) {
    return null;
  }

  return (
    <Alert variant={variant} className={className}>
      <AlertDescription>{content}</AlertDescription>
    </Alert>
  );
}

AlertWidget.displayName = "AlertWidget";

export default AlertWidget;
