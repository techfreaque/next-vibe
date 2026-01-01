/**
 * Response Fields Renderer Component
 * Renders response fields using WidgetRenderer
 *
 * This component:
 * 1. Takes tool result and widget metadata as input
 * 2. For each response field, renders using appropriate widget
 * 3. Handles array fields (LINK_LIST, DATA_TABLE, etc.)
 * 4. Handles object fields (CONTAINER)
 * 5. Handles primitive fields (TEXT, NUMBER, etc.)
 * 6. Reuses existing widgets - NO custom rendering
 *
 * Design Principles:
 * - Zero hardcoded widget logic
 * - Reuses WidgetRenderer for all fields
 * - Handles missing values gracefully
 * - Supports all widget types
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ToolCallResult } from "@/app/api/[locale]/agent/chat/db";
import type {
  CreateApiEndpointAny,
  UnifiedField,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type {
  WidgetData,
  WidgetRenderContext,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { WidgetRenderer } from "./WidgetRenderer";

interface ResponseFieldsRendererProps {
  result: ToolCallResult | undefined;
  definition: CreateApiEndpointAny;
  locale: CountryLanguage;
  context: WidgetRenderContext;
}

/**
 * Transform data for specific widget types
 * Some widgets expect specific data structures
 */
function transformDataForWidget(
  widgetType: WidgetType,
  value: ToolCallResult,
): ToolCallResult {
  // LINK_LIST expects { items: [...] } format
  if (widgetType === WidgetType.LINK_LIST && Array.isArray(value)) {
    return {
      items: value,
      layout: "list",
    };
  }

  // GROUPED_LIST expects { groups: [...] } format
  if (widgetType === WidgetType.GROUPED_LIST && Array.isArray(value)) {
    return {
      groups: value,
    };
  }

  // DATA_TABLE expects { rows: [...], columns: [...] } format
  if (widgetType === WidgetType.DATA_TABLE && Array.isArray(value)) {
    // Auto-detect columns from first row
    const firstRow = value[0];
    if (firstRow && typeof firstRow === "object" && !Array.isArray(firstRow)) {
      const columns = Object.keys(firstRow).map((key) => ({
        key,
        label: key,
      }));
      return {
        rows: value,
        columns,
      };
    }
  }

  // No transformation needed
  return value;
}

/**
 * Render a single response field using WidgetRenderer
 */
function renderResponseField<const TKey extends string>(
  fieldKey: string,
  field: UnifiedField<TKey>,
  result: ToolCallResult | null,
  context: WidgetRenderContext,
  endpoint: CreateApiEndpointAny,
): JSX.Element | null {
  // Handle null result
  if (!result) {
    return null;
  }

  // Get field value from result using the passed fieldKey
  const fieldValue = result[fieldKey as keyof typeof result];

  // Skip if no value
  if (fieldValue === undefined || fieldValue === null) {
    return null;
  }

  // Transform data for widget type
  const transformedData = transformDataForWidget(field.ui.type, fieldValue);

  // Use WidgetRenderer to render the field
  return (
    <Div key={fieldKey} className="flex flex-col gap-1">
      {/* Field Label (if provided) */}
      {"label" in field.ui &&
        field.ui.label &&
        typeof field.ui.label === "string" && (
          <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
            {field.ui.label}
          </Span>
        )}

      {/* Widget Renderer */}
      <Div className="pl-0">
        <WidgetRenderer
          widgetType={field.ui.type}
          data={transformedData as WidgetData}
          field={field}
          context={context}
          endpoint={endpoint}
        />
      </Div>
    </Div>
  );
}

/**
 * Fallback renderer for when no widget metadata is available
 * Shows JSON dump with warning
 */
function renderFallback(
  result: ToolCallResult,
  locale: CountryLanguage,
): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col gap-2">
      <Div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        <Span>⚠️</Span>
        <Span>
          {t(
            "app.api.system.unifiedInterface.react.widgets.toolCall.messages.metadataNotAvailable",
          )}
        </Span>
      </Div>
      <Pre className="text-xs bg-accent border border-border/30 rounded-md p-3 overflow-x-auto">
        {JSON.stringify(result, null, 2)}
      </Pre>
    </Div>
  );
}

/**
 * Response Fields Renderer Component
 * Renders tool result using widget metadata
 */
export function ResponseFieldsRenderer({
  result,
  definition,
  locale,
  context,
}: ResponseFieldsRendererProps): JSX.Element {
  const { t } = simpleT(locale);

  if (!result) {
    return (
      <Div className="text-sm text-muted-foreground italic py-2">
        {t(
          "app.api.system.unifiedInterface.react.widgets.toolCall.messages.noResult",
        )}
      </Div>
    );
  }

  const responseFields: Array<{ key: string; field: UnifiedField<string> }> =
    [];
  if (
    definition?.fields &&
    typeof definition.fields === "object" &&
    "children" in definition.fields
  ) {
    const children = definition.fields.children as Record<
      string,
      UnifiedField<string>
    >;

    for (const [fieldKey, fieldDef] of Object.entries(children)) {
      if (
        "usage" in fieldDef &&
        typeof fieldDef.usage === "object" &&
        fieldDef.usage !== null
      ) {
        const usage = fieldDef.usage;
        let hasResponse = false;
        if ("response" in usage) {
          hasResponse = usage.response === true;
        } else {
          const usageValues = Object.values(usage);
          hasResponse = usageValues.some(
            (methodUsage) =>
              typeof methodUsage === "object" &&
              methodUsage !== null &&
              "response" in methodUsage &&
              methodUsage.response === true,
          );
        }
        if (hasResponse) {
          responseFields.push({ key: fieldKey, field: fieldDef });
        }
      }
    }
  }

  if (responseFields.length === 0) {
    return renderFallback(result, locale);
  }

  return (
    <Div className="flex flex-col gap-3">
      {responseFields.map(({ key, field }) =>
        renderResponseField(key, field, result, context, definition),
      )}
    </Div>
  );
}
