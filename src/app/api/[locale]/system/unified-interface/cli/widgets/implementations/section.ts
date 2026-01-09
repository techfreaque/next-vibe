/**
 * Section Widget Renderer
 * Handles SECTION widget type for organizing content into labeled sections
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All business logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { isSectionEmpty } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/section";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import {
  hasChildren,
  isWidgetDataArray,
  isWidgetDataObject,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/field-type-guards";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class SectionWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.SECTION> {
  readonly widgetType = WidgetType.SECTION;

  render(props: CLIWidgetProps<typeof WidgetType.SECTION, string>): string {
    const { value, context } = props;

    // Use type guard from central file
    if (isWidgetDataObject(value)) {
      return this.renderSection(value, props, context);
    }

    return JSON.stringify(value);
  }

  private renderSection(
    value: { [key: string]: WidgetData },
    props: CLIWidgetProps<typeof WidgetType.SECTION, string>,
    context: WidgetRenderContext,
  ): string {
    const result: string[] = [];
    const { field } = props;
    const { title: titleKey } = field.ui;

    // Use shared logic from section.ts
    if (isSectionEmpty(value)) {
      return "";
    }

    if (titleKey) {
      const title = context.t(titleKey);
      result.push("");
      result.push(this.styleText(title.toUpperCase(), "bold", context));
      result.push(this.styleText("─".repeat(50), "dim", context));
    }

    // Use centralized renderChildren helper - eliminates duplication
    const renderedChildren = this.renderChildren(field, value, context);
    result.push(...renderedChildren);

    // Handle fields without metadata (fallback)
    if (!hasChildren(field)) {
      for (const [key, val] of Object.entries(value)) {
        if (val !== undefined && val !== null) {
          result.push(this.renderSimpleField(key, val, context));
        }
      }
    }

    return result.join("\n");
  }

  /**
   * Render a simple field when no metadata is available.
   * Uses centralized renderValue helper for consistent formatting.
   */
  private renderSimpleField(key: string, value: WidgetData, context: WidgetRenderContext): string {
    if (value === null || value === undefined) {
      return "";
    }

    // Special handling for arrays - preserve original formatting
    if (isWidgetDataArray(value)) {
      if (value.length === 0) {
        return "";
      }
      return value.map((item) => `  ${this.renderValue(item, context)}`).join("\n");
    }

    // Use centralized renderValue for consistent formatting
    const formattedValue = this.renderValue(value, context);
    return `${key}: ${formattedValue}`;
  }
}
