/**
 * Container Widget Renderer
 * Handles CONTAINER widget type for grouping related fields with layout
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { BaseWidgetRenderer } from "./base-widget-renderer";
import type { ResponseFieldMetadata, WidgetRenderContext } from "./types";

/**
 * Container widget renderer for organizing related fields
 */
export class ContainerWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.CONTAINER;
  }

  render(field: ResponseFieldMetadata, context: WidgetRenderContext): string {
    const value = field.value;

    // Handle object with nested fields (like summary with metric cards)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderContainerObject(value, field, context);
    }

    // Fallback to simple display
    const label = this.formatLabel(field, context);
    const valueStr =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${label}: ${valueStr}`;
  }

  /**
   * Render container object with nested fields
   */
  private renderContainerObject(
    value: Record<string, string | number | boolean>,
    field: ResponseFieldMetadata,
    context: WidgetRenderContext,
  ): string {
    const config = this.getContainerConfig(field);
    const result: string[] = [];

    // Add container title if present
    if (field.label) {
      const title = context.translate(field.label);
      const titleIcon = (config.icon) || "📊 ";
      const titleWithIcon = titleIcon + title;
      const styledTitle = this.styleText(titleWithIcon, "bold", context);
      result.push(styledTitle);
    }

    // Add container description if present
    if (field.description) {
      const description = context.translate(field.description);
      result.push(`   ${description}`);
      result.push("");
    }

    // Render fields based on layout
    const fieldsOutput = this.renderFields(value, config, context);
    result.push(fieldsOutput);

    return result.join("\n");
  }

  /**
   * Render fields within the container
   */
  private renderFields(
    data: Record<string, string | number | boolean>,
    config: any,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];
    const layout = config.layout || { type: "vertical", columns: 1 };

    // For grid layout with multiple columns, render in a grid format
    if (layout.type === "grid" && layout.columns > 1) {
      return this.renderGridLayout(data, layout.columns, context);
    }

    // For vertical layout, render each field on its own line
    for (const [key, value] of Object.entries(data)) {
      const formattedValue = this.formatContainerValue(key, value, context);
      result.push(formattedValue);
    }

    return result.join("\n");
  }

  /**
   * Render fields in a grid layout
   */
  private renderGridLayout(
    data: Record<string, string | number | boolean>,
    columns: number,
    context: WidgetRenderContext,
  ): string {
    const entries = Object.entries(data);
    const result: string[] = [];

    // Process entries in chunks based on column count
    for (let i = 0; i < entries.length; i += columns) {
      const chunk = entries.slice(i, i + columns);
      const row = chunk
        .map(([key, value]) => this.formatContainerValue(key, value, context))
        .join("  ");
      result.push(row);
    }

    return result.join("\n");
  }

  /**
   * Format a single container value (like a metric card)
   */
  private formatContainerValue(
    key: string,
    value: string | number | boolean,
    context: WidgetRenderContext,
  ): string {
    // Format as metric card style
    const icon = this.getMetricIcon(key, value, context);
    const label = this.formatMetricLabel(key);
    const formattedValue = this.formatMetricValue(value, context);

    return `${icon}${label}: ${formattedValue}`;
  }

  /**
   * Get icon for metric based on configuration
   */
  private getMetricIcon(
    _key: string,
    _value: string | number | boolean,
    context: WidgetRenderContext,
  ): string {
    if (!context.options.useEmojis) {
      return "";
    }

    // Default icon for metrics
    // eslint-disable-next-line i18next/no-literal-string
    return "📊 ";
  }

  /**
   * Format metric label from camelCase key
   */
  private formatMetricLabel(key: string): string {
    // Convert camelCase to Title Case
    const spaced = key.replace(/([A-Z])/g, (match) => ` ${match}`);
    return spaced.replace(/^./, (str) => str.toUpperCase()).trim();
  }

  /**
   * Format metric value (handle integers properly)
   */
  private formatMetricValue(value: string | number | boolean): string {
    if (typeof value === "number") {
      // For integers, don't show decimal places
      if (Number.isInteger(value)) {
        return value.toString();
      } else {
        return value.toFixed(2);
      }
    }

    return String(value);
  }

  /**
   * Format duration from milliseconds to human-readable format
   */
  private formatDuration(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)}s`;
  }

  /**
   * Get container configuration
   */
  private getContainerConfig(_field: ResponseFieldMetadata): any {
    const config = _field.config || {};

    return {
      layout: config.layout || { type: "vertical", columns: 1 },
      icon: config.icon,
      border: config.border ?? false,
      spacing: config.spacing || "normal",
    };
  }
}
