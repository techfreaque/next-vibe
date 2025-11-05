/**
 * Request Fields Renderer Component
 * Renders request fields (tool arguments) as read-only display
 *
 * This component:
 * 1. Takes tool arguments (args) as input
 * 2. Renders each field as read-only display
 * 3. Shows field label, value, and type icon
 * 4. Formats values appropriately (dates, numbers, booleans, etc.)
 * 5. Supports nested objects and arrays
 *
 * Design Principles:
 * - Read-only display (not editable form)
 * - Same styling as forms but without inputs
 * - Proper value formatting
 * - Handles all data types
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ToolCallResult } from "@/app/api/[locale]/v1/core/agent/chat/db";
import type { WidgetRenderContext } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/ui/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface RequestFieldsRendererProps {
  args: ToolCallResult;
  locale: CountryLanguage;
  context: WidgetRenderContext;
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return `Array (${value.length} items)`;
  }
  if (typeof value === "object") {
    return `Object (${Object.keys(value).length} fields)`;
  }
  return String(value);
}

/**
 * Get icon for value type
 */
function getTypeIcon(value: unknown): string {
  if (value === null || value === undefined) {
    return "∅";
  }
  if (typeof value === "boolean") {
    return value ? "✓" : "✗";
  }
  if (typeof value === "number") {
    return "#";
  }
  if (typeof value === "string") {
    return "\"";
  }
  if (Array.isArray(value)) {
    return "[]";
  }
  if (typeof value === "object") {
    return "{}";
  }
  return "?";
}

/**
 * Get color class for value type
 */
function getTypeColor(value: unknown): string {
  if (value === null || value === undefined) {
    return "text-muted-foreground/50";
  }
  if (typeof value === "boolean") {
    return value ? "text-green-500" : "text-red-500";
  }
  if (typeof value === "number") {
    return "text-blue-500";
  }
  if (typeof value === "string") {
    return "text-purple-500";
  }
  if (Array.isArray(value)) {
    return "text-orange-500";
  }
  if (typeof value === "object") {
    return "text-cyan-500";
  }
  return "text-muted-foreground";
}

/**
 * Render a single field
 */
function renderField(
  key: string,
  value: unknown,
  depth = 0,
): JSX.Element {
  const isComplex = typeof value === "object" && value !== null;
  const indent = depth * 16; // 16px per level

  return (
    <Div key={key} className="space-y-1" style={{ marginLeft: `${indent}px` }}>
      <Div className="flex items-start gap-2">
        {/* Type Icon */}
        <Span
          className={cn(
            "text-xs font-mono mt-0.5",
            getTypeColor(value),
          )}
        >
          {getTypeIcon(value)}
        </Span>

        {/* Field Label */}
        <Span className="text-sm font-medium text-foreground min-w-[100px]">
          {key}:
        </Span>

        {/* Field Value */}
        {!isComplex ? (
          <Span className="text-sm text-muted-foreground flex-1">
            {formatValue(value)}
          </Span>
        ) : null}
      </Div>

      {/* Nested Fields */}
      {isComplex && (
        <Div className="space-y-1">
          {Array.isArray(value) ? (
            // Render array items
            value.map((item, index) =>
              renderField(`[${index}]`, item, depth + 1),
            )
          ) : (
            // Render object fields
            Object.entries(value as Record<string, unknown>).map(
              ([nestedKey, nestedValue]) =>
                renderField(nestedKey, nestedValue, depth + 1),
            )
          )}
        </Div>
      )}
    </Div>
  );
}

/**
 * Request Fields Renderer Component
 * Renders tool arguments as read-only display
 */
export function RequestFieldsRenderer({
  args,
  locale,
  context: _context,
}: RequestFieldsRendererProps): JSX.Element {
  const { t } = simpleT(locale);

  // Handle empty args
  if (!args || typeof args !== "object" || Object.keys(args).length === 0) {
    return (
      <Div className="text-sm text-muted-foreground italic py-2">
        {t("app.api.v1.core.system.unifiedInterface.react.widgets.toolCall.messages.noArguments")}
      </Div>
    );
  }

  // Render all fields
  return (
    <Div className="space-y-2 rounded-md bg-muted border border-border/30 p-3">
      {Object.entries(args).map(([key, value]) => renderField(key, value))}
    </Div>
  );
}

