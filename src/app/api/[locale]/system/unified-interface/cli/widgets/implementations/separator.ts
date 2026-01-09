/**
 * Separator CLI Widget
 * Renders a horizontal line divider in the terminal
 */

import type { WidgetType } from "../../../shared/types/enums";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

/**
 * Render a separator (horizontal line) in the CLI
 */
export function renderSeparator<const TKey extends string>(
  props: CLIWidgetProps<typeof WidgetType.SEPARATOR, TKey>,
  context: WidgetRenderContext,
): string {
  const { field } = props;
  const { label } = field.ui;

  const translatedLabel = label ? context.t(label) : undefined;

  // Terminal width (default to 80 characters)
  const terminalWidth = process.stdout.columns || 80;
  const lineChar = "─";

  if (translatedLabel) {
    // Separator with label
    const labelText = ` ${translatedLabel} `;
    const labelWidth = labelText.length;
    const remainingWidth = terminalWidth - labelWidth;
    const leftWidth = Math.floor(remainingWidth / 2);
    const rightWidth = remainingWidth - leftWidth;

    return lineChar.repeat(leftWidth) + labelText + lineChar.repeat(rightWidth);
  }

  // Simple separator
  return lineChar.repeat(terminalWidth);
}
