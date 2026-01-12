/**
 * Text Widget Renderer
 * Handles TEXT widget type with various formatting options
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { extractTextData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/text";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

/**
 * Renders TEXT widgets with formatting options.
 */
export class TextWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.TEXT
> {
  readonly widgetType = WidgetType.TEXT;

  render(props: CLIWidgetProps<typeof WidgetType.TEXT, string>): string {
    const { field, value, context } = props;
    const indent = this.createIndent(context.depth, context);
    const label = this.formatLabel(field, context);

    const data = extractTextData(value);

    if (!data) {
      return `${indent}${label}: —`;
    }

    const formattedValue = context.formatValue(field, data.text);
    // Types flow from TextWidgetConfig - no assertions needed
    const { multiline, emphasis, label: labelKey } = field.ui;

    if (multiline) {
      return this.renderMultilineText(formattedValue, indent, label, context);
    }

    if (emphasis) {
      const styledValue = this.styleText(formattedValue, emphasis, context);
      return `${indent}${label}: ${styledValue}`;
    }

    const displayValue = formattedValue === "(not set)" ? "—" : formattedValue;

    if (!labelKey) {
      return `${indent}${displayValue}`;
    }

    return `${indent}${label}: ${displayValue}`;
  }

  private renderMultilineText(
    value: string,
    indent: string,
    label: string,
    context: WidgetRenderContext,
  ): string {
    if (!value || typeof value !== "string") {
      // eslint-disable-next-line i18next/no-literal-string
      return `${indent}${label}: (empty)`;
    }

    const lines = value.split("\n");
    const result = [`${indent}${label}:`];

    for (const line of lines) {
      const wrappedLine = this.wrapText(
        line,
        context.options.maxWidth - indent.length - 2,
        `${indent}  `,
      );
      result.push(`${indent}  ${wrappedLine}`);
    }

    return result.join("\n");
  }
}
