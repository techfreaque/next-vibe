"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { AlertWidgetConfig } from "./types";

/**
 * Displays alert messages with configurable variants.
 * Value should be a translation key string.
 */
export function AlertWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  AlertWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element | null {
  const { variant = "default", className, content: hardcodedContent } = field;

  let content: string | undefined;
  if (field.value) {
    content = context.t(field.value);
  } else if (hardcodedContent) {
    content = context.t(hardcodedContent);
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
