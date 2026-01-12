/**
 * Container Widget Renderer
 *
 * Renders container widgets that group related fields together with optional labels and descriptions.
 * Supports vertical and grid layouts with configurable column counts.
 *
 * Features:
 * - Hierarchical field rendering with proper nesting
 * - Grid and vertical layout modes
 * - Optional title and description display
 * - Icon support for container headers
 * - Recursive rendering of child widgets
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All business logic imported from shared.
 */

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  type ContainerConfig,
  extractContainerData,
  getContainerConfig,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/container";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  hasChildren,
  isWidgetDataObject,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";
import { formatCamelCaseLabel } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class ContainerWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CONTAINER
> {
  readonly widgetType = WidgetType.CONTAINER;

  /**
   * Render container widget with optional title, description, and nested fields.
   * Supports both object values with children and array values.
   * Handles vertical and grid layouts based on configuration.
   */
  render(props: CLIWidgetProps<typeof WidgetType.CONTAINER, string>): string {
    const { field, value, context } = props;

    // For container, we expect object values with children or named fields
    if (isWidgetDataObject(value)) {
      return this.renderContainerObject(value, field, context);
    }

    // Extract data using shared logic for array values
    const data = extractContainerData(value);

    // Handle null case
    if (!data) {
      const label = this.formatLabel(field, context);
      return `${label}: —`;
    }

    const label = this.formatLabel(field, context);
    const valueStr = isWidgetDataObject(value)
      ? JSON.stringify(value)
      : String(value);
    return `${label}: ${valueStr}`;
  }

  /**
   * Render container object with optional title and description.
   * Recursively renders child widgets or formats values.
   */
  private renderContainerObject<const TKey extends string>(
    value: { [key: string]: WidgetData },
    field: UnifiedField<TKey>,
    context: WidgetRenderContext,
    label?: string,
    description?: string,
  ): string {
    // Use shared config extraction
    const config = getContainerConfig(field);
    const result: string[] = [];

    if (label) {
      const title = context.t(label);
      const defaultIcon = context.options.useEmojis ? "📊 " : "";
      const titleIcon = config.icon || defaultIcon;
      const titleWithIcon = titleIcon + title;
      const styledTitle = this.styleText(titleWithIcon, "bold", context);
      result.push(styledTitle);
    }

    if (description) {
      const desc = context.t(description);
      result.push(`   ${desc}`);
      result.push("");
    }

    const fieldsOutput = this.renderFields(value, config, context, field);
    result.push(fieldsOutput);

    return result.join("\n");
  }

  /**
   * Render container fields in vertical or grid layout.
   * Recursively renders child widgets if field definitions exist.
   */
  private renderFields<const TKey extends string>(
    data: { [key: string]: WidgetData },
    config: ContainerConfig,
    context: WidgetRenderContext,
    field?: UnifiedField<TKey>,
  ): string {
    const result: string[] = [];
    const layout = config.layout || { type: "vertical" as const, columns: 1 };

    if (layout.type === "grid" && layout.columns && layout.columns > 1) {
      return this.renderGridLayout(data, layout.columns, context, field);
    }

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (field && hasChildren(field) && field.children[key]) {
        const childField = field.children[key];
        const rendered = context.renderWidget(
          childField.ui.type,
          childField,
          value,
        );
        if (rendered) {
          result.push(rendered);
        }
      } else {
        const formattedValue = this.formatContainerValue(key, value, context);
        result.push(formattedValue);
      }
    }

    return result.join("\n");
  }

  /**
   * Render fields in multi-column grid layout.
   * Each row contains up to the specified number of columns.
   */
  private renderGridLayout<const TKey extends string>(
    data: { [key: string]: WidgetData },
    columns: number,
    context: WidgetRenderContext,
    field?: UnifiedField<TKey>,
  ): string {
    const entries = Object.entries(data);
    const result: string[] = [];

    for (let i = 0; i < entries.length; i += columns) {
      const chunk = entries.slice(i, i + columns);
      const row = chunk
        .map(([key, value]) => {
          if (field && hasChildren(field) && field.children[key]) {
            const childField = field.children[key];
            return context.renderWidget(childField.ui.type, childField, value);
          }
          return this.formatContainerValue(key, value, context);
        })
        .join("  ");
      result.push(row);
    }

    return result.join("\n");
  }

  /**
   * Format a single container value using centralized helpers
   */
  private formatContainerValue(
    key: string,
    value: WidgetData,
    context: WidgetRenderContext,
  ): string {
    // Use centralized value rendering
    const icon = this.getValueIcon(value, context);
    const label = formatCamelCaseLabel(key);
    const formattedValue = this.renderValue(value, context);
    return `${icon}${label}: ${formattedValue}`;
  }
}
