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

import type { ToolCallResult } from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { ToolCallWidgetMetadata } from "@/app/api/[locale]/v1/core/system/unified-interface/ai/types";
import type {
  RenderableValue,
  ResponseFieldMetadata,
} from "@/app/api/[locale]/v1/core/system/unified-interface/cli/widgets/types";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/ui/types";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { WidgetRenderer } from "./WidgetRenderer";

interface ResponseFieldsRendererProps {
  result: ToolCallResult | undefined;
  widgetMetadata: ToolCallWidgetMetadata | undefined;
  locale: CountryLanguage;
  context: WidgetRenderContext;
}

/**
 * Transform data for specific widget types
 * Some widgets expect specific data structures
 */
function transformDataForWidget(
  widgetType: WidgetType,
  value: unknown,
): unknown {
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
        type: FieldDataType.TEXT,
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
function renderResponseField(
  field: ToolCallWidgetMetadata["responseFields"][number],
  result: ToolCallResult | null,
  context: WidgetRenderContext,
): JSX.Element | null {
  // Handle null result
  if (!result) {
    return null;
  }

  // Get field value from result
  const fieldValue = result[field.name as keyof typeof result];

  // Skip if no value
  if (fieldValue === undefined || fieldValue === null) {
    return null;
  }

  // Transform data for widget type
  const transformedData = transformDataForWidget(field.widgetType, fieldValue);

  // Create proper metadata structure
  const metadata: ResponseFieldMetadata = {
    name: field.name,
    type: FieldDataType.TEXT, // Default type, will be inferred from value
    widgetType: field.widgetType,
    value: transformedData as RenderableValue,
    label: field.label,
    description: field.description,
    config: field.layout as ResponseFieldMetadata["config"],
  };

  // Use WidgetRenderer to render the field
  return (
    <Div key={field.name} className="space-y-2">
      {/* Field Label (if provided) */}
      {field.label && (
        <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {field.label}
        </Span>
      )}

      {/* Widget Renderer */}
      <WidgetRenderer
        widgetType={field.widgetType}
        data={transformedData as RenderableValue}
        metadata={metadata}
        context={context}
      />
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
    <Div className="space-y-2">
      <Div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        <Span>⚠️</Span>
        <Span>
          {t(
            "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.metadataNotAvailable",
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
  widgetMetadata,
  locale,
  context,
}: ResponseFieldsRendererProps): JSX.Element {
  const { t } = simpleT(locale);

  // Handle no result
  if (!result) {
    return (
      <Div className="text-sm text-muted-foreground italic py-2">
        {t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.noResult",
        )}
      </Div>
    );
  }

  // Handle no widget metadata - fallback to JSON dump
  if (
    !widgetMetadata ||
    !widgetMetadata.responseFields ||
    widgetMetadata.responseFields.length === 0
  ) {
    return renderFallback(result, locale);
  }

  // Render all response fields using WidgetRenderer
  return (
    <Div className="space-y-3">
      {widgetMetadata.responseFields.map((field) =>
        renderResponseField(field, result, context),
      )}
    </Div>
  );
}
