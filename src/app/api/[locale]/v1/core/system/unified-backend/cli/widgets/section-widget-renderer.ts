/**
 * Section Widget Renderer
 * Handles SECTION widget type for organizing content into labeled sections
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type {
  RenderableValue,
  ResponseFieldMetadata,
  WidgetRenderContext,
} from "./types";

/**
 * Section widget renderer for organizing content
 */
export class SectionWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.SECTION;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const value = field.value;

    // Handle object with nested fields
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderSection(value, field, context);
    }

    // Fallback
    return JSON.stringify(value);
  }

  /**
   * Render section with title and nested content
   */
  private renderSection(
    value: { [key: string]: RenderableValue },
    field: ResponseFieldMetadata,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    // Skip rendering if section is empty (no items or all values are empty)
    if (this.isSectionEmpty(value)) {
      return "";
    }

    // Add section title if present
    if (field.title) {
      const title = field.title.includes(".")
        ? context.translate(field.title as any)
        : field.title;

      result.push("");
      result.push(this.styleText(title.toUpperCase(), "bold", context));
      result.push(this.styleText("─".repeat(50), "dim", context));
    }

    // Render nested fields
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined || val === null) continue;

      // Check if this field has metadata in the context
      const childMetadata = field.children?.[key];

      if (childMetadata) {
        // Use appropriate renderer based on widget type
        const renderer = context.getRenderer(childMetadata.widgetType);
        if (renderer) {
          const rendered = renderer.render(
            { ...childMetadata, value: val },
            context,
          );
          if (rendered) {
            result.push(rendered);
          }
        }
      } else {
        // Fallback rendering
        result.push(this.renderSimpleField(key, val, context));
      }
    }

    return result.join("\n");
  }

  /**
   * Check if section is empty (has no meaningful content)
   */
  private isSectionEmpty(value: { [key: string]: RenderableValue }): boolean {
    const entries = Object.entries(value);
    if (entries.length === 0) return true;

    // Check if all values are empty/null/undefined
    return entries.every(([_, val]) => {
      if (val === null || val === undefined) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      if (typeof val === "object" && Object.keys(val).length === 0) return true;
      return false;
    });
  }

  /**
   * Render a simple field when no metadata is available
   */
  private renderSimpleField(
    key: string,
    value: RenderableValue,
    context: WidgetRenderContext,
  ): string {
    if (value === null || value === undefined) return "";

    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      return value.map((item) => `  ${item}`).join("\n");
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return `${key}: ${value}`;
  }
}
