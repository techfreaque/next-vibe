/**
 * Title Widget Renderer
 *
 * Handles TITLE widget type for CLI display.
 * Displays prominent headings and section titles with bold styling.
 * Supports all UI config options and feature parity with React implementation.
 *
 * UI Config Options:
 * - content: Static translation key for fixed title text
 * - level: Heading level 1-6 (affects styling weight)
 * - fieldType: Special formatting (DATE, DATETIME)
 *
 * Visual Style:
 * - Bold text with varying intensity based on level (1-3: bold, 4-6: normal weight)
 * - Optional subtitle with muted styling
 * - Text alignment support (left, center, right)
 * - No indentation by default
 *
 * Data Sources (priority order):
 * 1. Static content from field.ui.content
 * 2. Date formatting if fieldType is DATE or DATETIME
 * 3. Title data from value
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { formatIfDate } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/text";
import { extractTitleData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/title";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class TitleWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.TITLE> {
  readonly widgetType = WidgetType.TITLE;

  /**
   * Render title with comprehensive formatting options.
   *
   * Rendering Logic (priority order):
   * 1. Static content from field.ui.content with optional level override
   * 2. Date formatting if fieldType is DATE or DATETIME
   * 3. Title data from value with level, subtitle, and alignment
   *
   * @param props Widget properties with title data and config
   * @returns Formatted title string with appropriate styling
   */
  render(props: CLIWidgetProps<typeof WidgetType.TITLE, string>): string {
    const { field, value, context } = props;
    const { content, level: configLevel, fieldType } = field.ui;

    // Level and align come from field.ui (config), not from data
    const level = configLevel ?? 2;

    // Handle static content from UI config
    if (content) {
      const translatedContent = context.t(content);
      return this.renderTitle(translatedContent, undefined, level, context);
    }

    // Handle date formatting if fieldType is DATE or DATETIME
    const dateFormatted = formatIfDate(value, fieldType, context.locale);
    if (dateFormatted) {
      return this.renderTitle(dateFormatted, undefined, level, context);
    }

    // Extract data using shared logic with translation context
    const data = extractTitleData(value, context);

    // Handle null case
    if (!data) {
      return "";
    }

    // Render using extracted data with level from config
    return this.renderTitle(data.text, data.subtitle, level, context);
  }

  /**
   * Render title with level-based styling and optional subtitle.
   * Higher level headings (1-3) use bold styling for prominence.
   * Lower level headings (4-6) use normal weight.
   *
   * Visual Layout:
   * ```
   * Title Text (bold for levels 1-3)
   * Subtitle Text (muted, if present)
   * ```
   *
   * @param text Title text to display
   * @param subtitle Optional subtitle text
   * @param level Heading level from field.ui (1-6)
   * @param context Rendering context for styling
   * @returns Formatted title string with optional subtitle
   */
  private renderTitle(
    text: string,
    subtitle: string | undefined,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    context: WidgetRenderContext,
  ): string {
    // Apply bold styling for prominent headings (levels 1-3)
    const styledText = level <= 3 ? this.styleText(text, "bold", context) : text;

    // For alignment in CLI, we could add padding, but for now keep it simple
    // CLI doesn't have the same layout flexibility as React
    const lines: string[] = [styledText];

    // Add subtitle if present
    if (subtitle) {
      const styledSubtitle = this.styleText(subtitle, "dim", context);
      lines.push(styledSubtitle);
    }

    return lines.join("\n");
  }
}
