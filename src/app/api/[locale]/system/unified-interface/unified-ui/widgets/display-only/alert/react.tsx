"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
  ReactWidgetPropsNoValue,
} from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
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
  props: TUsage extends { response: true }
    ? ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        AlertWidgetConfig<TKey, AlertWidgetSchema, TUsage, "primitive">
      >
    : TUsage extends { request?: never; response?: never }
      ? ReactStaticWidgetProps<
          TEndpoint,
          TUsage,
          AlertWidgetConfig<TKey, never, TUsage, "widget">
        >
      : ReactWidgetPropsNoValue<
          TEndpoint,
          TUsage,
          AlertWidgetConfig<TKey, AlertWidgetSchema, TUsage, "primitive">
        >,
): JSX.Element | null {
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
  const {
    variant = "default",
    className,
    content: hardcodedContent,
  } = props.field;
  const usage = "usage" in field ? field.usage : undefined;

  // Get value from form for request fields, otherwise from field.value
  let value;
  if (usage?.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value && "value" in field) {
      value = field.value;
    }
  } else if ("value" in field) {
    value = field.value;
  }

  let content: string | undefined;
  if (value) {
    content = t(value);
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
