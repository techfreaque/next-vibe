"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * KeyValue Widget - Displays record/dictionary data as key-value pairs
 *
 * Renders object/record data with proper formatting for keys and values.
 * Automatically translates keys if they match translation patterns.
 *
 * Features:
 * - Clean horizontal key-value layout
 * - Automatic translation of keys
 * - Number formatting with badges
 * - Compact, professional design
 * - Optional label/title display
 *
 * Data Format:
 * - Record<string, string | number> - Key-value pairs
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Record data to display
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function KeyValueWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.KEY_VALUE, TKey>): JSX.Element {
  const { label: labelKey } = field.ui;
  const label = labelKey ? context.t(labelKey) : undefined;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return (
      <Div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <Span className="text-sm font-medium text-muted-foreground">
            {label}
          </Span>
        )}
        <Span className="text-sm">—</Span>
      </Div>
    );
  }

  const record = value as Record<string, string | number>;
  const entries = Object.entries(record);

  if (entries.length === 0) {
    return (
      <Div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <Span className="text-sm font-medium text-muted-foreground">
            {label}
          </Span>
        )}
        <Span className="text-sm">—</Span>
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Span className="text-sm font-medium text-muted-foreground">
          {label}
        </Span>
      )}
      <Div className="flex flex-wrap gap-3">
        {entries.map(([key, val]) => {
          // Try to translate key, fallback to raw key
          const translatedKey = key.startsWith("app.") ? context.t(key) : key;
          const displayValue =
            typeof val === "number"
              ? val.toLocaleString(context.locale)
              : String(val);

          return (
            <Div
              key={key}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
            >
              <Span className="text-sm text-muted-foreground">
                {translatedKey}:
              </Span>
              <Badge variant="secondary" className="font-semibold">
                {displayValue}
              </Badge>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

KeyValueWidget.displayName = "KeyValueWidget";
