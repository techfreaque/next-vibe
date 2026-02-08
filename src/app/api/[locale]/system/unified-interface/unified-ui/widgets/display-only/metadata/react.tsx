"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type {
  ReactRequestResponseWidgetProps,
  ReactStaticWidgetProps,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { MetadataWidgetConfig, MetadataWidgetSchema } from "./types";

/**
 * Metadata Widget - Displays very small, muted supplementary text
 *
 * Renders extremely small text (11px) with high opacity muting, typically used
 * for metadata, timestamps, or other secondary information in compact displays.
 * Automatically translates string values.
 *
 * Features:
 * - Extra small text size (11px) for compact metadata
 * - High muting (70% opacity) for de-emphasized content
 * - Automatic translation of string values
 * - Minimal visual footprint for dense layouts
 *
 * Data Format:
 * - string: Direct text value (translated via context.t)
 * - Other types: Converted to string and displayed
 * - null/undefined: Shows "—" placeholder
 */
export function MetadataWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactStaticWidgetProps<
        TEndpoint,
        TUsage,
        MetadataWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactRequestResponseWidgetProps<
        TEndpoint,
        TUsage,
        MetadataWidgetConfig<TKey, MetadataWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const { field } = props;
  const fieldName = "fieldName" in props ? props.fieldName : undefined;
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

  // Handle string values
  if (typeof value === "string") {
    return (
      <Span
        className={cn("text-[11px] text-muted-foreground/70", field.className)}
      >
        {t(value)}
      </Span>
    );
  }

  // Handle null/undefined
  if (!value) {
    return (
      <Span
        className={cn("text-[11px] text-muted-foreground/70", field.className)}
      >
        —
      </Span>
    );
  }

  // Handle object with key-value pairs
  const entries = Object.entries(value);

  return (
    <Span
      className={cn("text-[11px] text-muted-foreground/70", field.className)}
    >
      {entries.map(([key, val]) => `${key}: ${val}`).join(", ")}
    </Span>
  );
}

MetadataWidget.displayName = "MetadataWidget";

export default MetadataWidget;
