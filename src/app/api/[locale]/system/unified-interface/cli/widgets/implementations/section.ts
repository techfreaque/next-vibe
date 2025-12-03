/**
 * Section Widget Renderer
 * Handles SECTION widget type for organizing content into labeled sections
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";
import type {
  WidgetData,
  WidgetInput,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

export class SectionWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.SECTION;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { field, value } = input;

    // Handle object with nested fields
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderSection(value, field, context);
    }

    // Fallback
    return JSON.stringify(value);
  }

  private renderSection(
    value: { [key: string]: WidgetData },
    field: UnifiedField,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];

    // Skip rendering if section is empty (no items or all values are empty)
    if (this.isSectionEmpty(value)) {
      return "";
    }

    if ("title" in field.ui && field.ui.title) {
      const title = context.t(field.ui.title);

      result.push("");
      result.push(this.styleText(title.toUpperCase(), "bold", context));
      result.push(this.styleText("─".repeat(50), "dim", context));
    }

    // Render nested fields
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined || val === null) {
        continue;
      }

      if (field.type === "object" && field.children?.[key]) {
        const childField = field.children[key];
        const renderer = context.getRenderer(childField.ui.type);
        if (renderer) {
          const rendered = renderer.render(
            { field: childField, value: val, context },
            context,
          );
          if (rendered) {
            result.push(rendered);
          }
        }
      } else {
        // Fallback rendering
        result.push(this.renderSimpleField(key, val));
      }
    }

    return result.join("\n");
  }

  /**
   * Check if section is empty (has no meaningful content)
   */
  private isSectionEmpty(value: { [key: string]: WidgetData }): boolean {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return true;
    }

    // Check if all values are empty/null/undefined
    return entries.every((entry) => {
      const val = entry[1];
      if (val === null || val === undefined) {
        return true;
      }
      if (Array.isArray(val) && val.length === 0) {
        return true;
      }
      if (typeof val === "object" && Object.keys(val).length === 0) {
        return true;
      }
      return false;
    });
  }

  /**
   * Render a simple field when no metadata is available
   */
  private renderSimpleField(key: string, value: WidgetData): string {
    if (value === null || value === undefined) {
      return "";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "";
      }
      return value.map((item) => `  ${item}`).join("\n");
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return `${key}: ${value}`;
  }
}
