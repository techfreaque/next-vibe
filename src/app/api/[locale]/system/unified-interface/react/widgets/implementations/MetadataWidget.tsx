"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

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
 *
 * @param value - Metadata text to display
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function MetadataWidget<const TKey extends string>({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.METADATA, TKey>): JSX.Element {
  if (!value) {
    return <Span className={className}>—</Span>;
  }

  const text = typeof value === "string" ? context.t(value) : String(value);

  return <Span className={cn("text-[11px] text-muted-foreground/70", className)}>{text}</Span>;
}

MetadataWidget.displayName = "MetadataWidget";
