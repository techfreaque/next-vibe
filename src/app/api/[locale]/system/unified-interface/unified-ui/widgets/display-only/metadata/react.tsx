"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

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
  TSchema extends MetadataWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  context,
  field,
}: ReactWidgetProps<
  TEndpoint,
  MetadataWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const text =
    typeof field.value === "string" ? context.t(field.value) : field.value;

  return (
    <Span
      className={cn("text-[11px] text-muted-foreground/70", field.className)}
    >
      {text}
    </Span>
  );
}

MetadataWidget.displayName = "MetadataWidget";

export default MetadataWidget;
