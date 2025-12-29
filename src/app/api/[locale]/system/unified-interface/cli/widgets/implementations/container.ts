/**
 * Container Widget Renderer
 * Pure rendering implementation - ANSI codes, styling, layout only
 * All business logic imported from shared
 */

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  type ContainerConfig,
  extractContainerData,
  getContainerConfig,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/container";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { getTranslator } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-helpers";
import { formatCamelCaseLabel } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/formatting";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class ContainerWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.CONTAINER
> {
  readonly widgetType = WidgetType.CONTAINER;

  render(props: CLIWidgetProps<typeof WidgetType.CONTAINER, string>): string {
    const { field, value, context } = props;

    // Extract data using shared logic
    const data = extractContainerData(value);

    // Handle null case
    if (!data) {
      const label = this.formatLabel(field, context);
      return `${label}: —`;
    }

    // For container, we expect object values with children
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return this.renderContainerObject(value, field, context);
    }

    const label = this.formatLabel(field, context);
    const valueStr =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${label}: ${valueStr}`;
  }

  private renderContainerObject<const TKey extends string>(
    value: { [key: string]: WidgetData },
    field: UnifiedField<TKey>,
    context: WidgetRenderContext,
  ): string {
    // Use shared config extraction
    const config = getContainerConfig(field);
    const result: string[] = [];
    const { t } = getTranslator(context);

    if ("label" in field.ui && field.ui.label) {
      const title = t(field.ui.label);
      const defaultIcon = context.options.useEmojis ? "📊 " : "";
      const titleIcon = config.icon || defaultIcon;
      const titleWithIcon = titleIcon + title;
      const styledTitle = this.styleText(titleWithIcon, "bold", context);
      result.push(styledTitle);
    }

    if ("description" in field.ui && field.ui.description) {
      const description = t(field.ui.description);
      result.push(`   ${description}`);
      result.push("");
    }

    const fieldsOutput = this.renderFields(value, config, context, field);
    result.push(fieldsOutput);

    return result.join("\n");
  }

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

      if (field?.type === "object" && field.children?.[key]) {
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
          if (field?.type === "object" && field.children?.[key]) {
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
   * Format a single container value (like a metric card) - RENDERING ONLY
   */
  private formatContainerValue(
    key: string,
    value: WidgetData,
    context: WidgetRenderContext,
  ): string {
    // Handle primitive values
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const icon = this.getMetricIcon(context);
      // Use shared formatting utility
      const label = formatCamelCaseLabel(key);
      const formattedValue =
        typeof value === "number" && Number.isInteger(value)
          ? value.toString()
          : typeof value === "number"
            ? value.toFixed(2)
            : String(value);
      return `${icon}${label}: ${formattedValue}`;
    }

    // Handle complex values
    const label = formatCamelCaseLabel(key);
    return `${label}: ${JSON.stringify(value)}`;
  }

  /**
   * Get icon for metric based on configuration (RENDERING ONLY)
   */
  private getMetricIcon(context: WidgetRenderContext): string {
    if (!context.options.useEmojis) {
      return "";
    }

    // Default icon for metrics
    // eslint-disable-next-line i18next/no-literal-string
    return "📊 ";
  }
}
