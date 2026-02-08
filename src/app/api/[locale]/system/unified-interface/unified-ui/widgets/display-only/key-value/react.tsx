"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactRequestResponseWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { KeyValueWidgetConfig, KeyValueWidgetSchema } from "./types";

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
 */
export function KeyValueWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends KeyValueWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactRequestResponseWidgetProps<
  TEndpoint,
  TUsage,
  KeyValueWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const form = useWidgetForm();
  const { label: labelKey, className, usage } = field;
  const label = labelKey ? t(labelKey) : undefined;

  // Get value from form for request fields, otherwise from field.value
  let value;
  if (usage.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value) {
      value = field.value;
    }
  } else {
    value = field.value;
  }

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

  const record = value;
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
          const translatedKey = t(key);
          const displayValue =
            typeof val === "number" ? val.toLocaleString(locale) : String(val);

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

export default KeyValueWidget;
