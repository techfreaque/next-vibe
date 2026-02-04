"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        MetadataWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        MetadataWidgetConfig<TKey, MetadataWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const t = useWidgetTranslation();
  const { field } = props;
  // Handle string values
  if (typeof field.value === "string") {
    return (
      <Span
        className={cn("text-[11px] text-muted-foreground/70", field.className)}
      >
        {t(field.value)}
      </Span>
    );
  }

  // Handle null/undefined
  if (!field.value) {
    return (
      <Span
        className={cn("text-[11px] text-muted-foreground/70", field.className)}
      >
        —
      </Span>
    );
  }

  // Handle object with key-value pairs
  const entries = Object.entries(field.value);

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
