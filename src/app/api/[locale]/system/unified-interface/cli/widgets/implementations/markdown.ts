/**
 * Markdown Widget Renderer
 *
 * Handles MARKDOWN widget type for CLI display.
 * Converts markdown to plain text with ANSI formatting support for:
 * - Headings (# to ######) - bold style
 * - Bold text (**text** or __text__) - bold style
 * - Italic text (*text* or _text_) - dim style
 * - Inline code (`code`) - blue style
 * - Code blocks (```code```) - blue style
 * - Unordered lists (- item, * item) - bullet points
 * - Ordered lists (1. item) - preserved as-is
 * - Links [text](url) - blue text with dimmed URL
 * - Horizontal rules (--- or ***) - separator lines
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractMarkdownData,
  type ProcessedMarkdown,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/markdown";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class MarkdownWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.MARKDOWN> {
  readonly widgetType = WidgetType.MARKDOWN;

  /**
   * Render markdown content with ANSI formatting.
   * Uses shared extraction logic to process markdown data,
   * then converts markdown syntax to CLI-friendly formatted text.
   *
   * @param props Widget properties with markdown content and rendering context
   * @returns Formatted markdown string with ANSI codes and indentation
   */
  render(props: CLIWidgetProps<typeof WidgetType.MARKDOWN, string>): string {
    const { value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractMarkdownData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderMarkdown(data, context);
  }

  /**
   * Render markdown content with formatting and indentation.
   * Converts markdown syntax to ANSI-formatted text, then applies
   * consistent indentation to each line based on nesting depth.
   *
   * @param data Processed markdown data with content
   * @param context Rendering context with depth and options
   * @returns Formatted and indented markdown string
   */
  private renderMarkdown(data: ProcessedMarkdown, context: WidgetRenderContext): string {
    const { content } = data;
    const indent = this.createIndent(context.depth, context);

    // Convert markdown to plain text with basic formatting
    const formatted = this.convertMarkdownToPlainText(content, context);

    // Apply indentation to each line
    const lines = formatted.split("\n");
    return lines.map((line) => `${indent}${line}`).join("\n");
  }

  /**
   * Convert markdown syntax to plain text with ANSI formatting.
   * Processes markdown elements using regex replacements to convert to CLI-friendly format.
   *
   * Supported Markdown Elements:
   * - Headings (# to ######): Converted to bold text
   * - Bold (**text** or __text__): Converted to bold ANSI style
   * - Italic (*text* or _text_): Converted to dim ANSI style
   * - Inline code (`code`): Converted to blue ANSI style
   * - Code blocks (```code```): Converted to blue ANSI style
   * - Unordered lists (- item, * item): Converted to bullet points (• or -)
   * - Ordered lists (1. item): Preserved as-is with numbering
   * - Links [text](url): Converted to blue text with dimmed URL in parentheses
   * - Horizontal rules (--- or ***): Converted to separator lines (────)
   *
   * Processing Order:
   * 1. Headings → bold
   * 2. Bold markers → bold style
   * 3. Italic markers → dim style
   * 4. Inline code → blue style
   * 5. Code blocks → blue style
   * 6. Unordered lists → bullets
   * 7. Ordered lists → preserved
   * 8. Links → styled with URL
   * 9. Horizontal rules → separators
   *
   * @param content Raw markdown string to convert
   * @param context Rendering context for styling and emoji support
   * @returns Converted text with ANSI formatting codes
   */
  private convertMarkdownToPlainText(content: string, context: WidgetRenderContext): string {
    let result = content;

    // Convert headings (# Heading)
    // oxlint-disable-next-line no-unused-vars
    result = result.replaceAll(/^#{1,6}\s+(.+)$/gm, (match, heading) => {
      return this.styleText(heading, "bold", context);
    });

    // Convert bold (**text** or __text__)
    // oxlint-disable-next-line no-unused-vars
    result = result.replaceAll(/(\*\*|__)(.+?)\1/g, (match, marker, text) => {
      return this.styleText(text, "bold", context);
    });

    // Convert italic (*text* or _text_)
    // oxlint-disable-next-line no-unused-vars
    result = result.replaceAll(/(\*|_)(.+?)\1/g, (match, marker, text) => {
      return this.styleText(text, "dim", context);
    });

    // oxlint-disable-next-line no-unused-vars
    // Convert inline code (`code`)
    // oxlint-disable-next-line no-unused-vars
    result = result.replaceAll(/`([^`]+)`/g, (match, code) => {
      return this.styleText(code, "blue", context);
    });

    // Convert code blocks (```code```)
    result = result.replaceAll(/```[\s\S]*?```/g, (match) => {
      // Remove the backticks
      const code = match.replaceAll("```", "");
      return this.styleText(code, "blue", context);
    });

    // Convert unordered lists (- item or * item)
    // oxlint-disable-next-line no-unused-vars
    result = result.replaceAll(/^[*-]\s+(.+)$/gm, (match, item) => {
      const bullet = context.options.useEmojis ? "•" : "-";
      // eslint-disable-next-line i18next/no-literal-string
      return `${bullet} ${item}`;
    });

    // Convert ordered lists (1. item)
    result = result.replaceAll(/^\d+\.\s+(.+)$/gm, (match) => {
      return match; // Keep numbered lists as-is
    });

    // Convert links [text](url)
    result = result.replaceAll(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      // oxlint-disable-next-line no-unused-vars
      (match, text, url) => {
        // For CLI, just show the text with URL in dim
        const styledText = this.styleText(text, "blue", context);
        const styledUrl = this.styleText(`(${url})`, "dim", context);
        // eslint-disable-next-line i18next/no-literal-string
        return `${styledText} ${styledUrl}`;
      },
    );

    // Convert horizontal rules (--- or ***)
    result = result.replaceAll(/^(\*{3,}|-{3,})$/gm, () => {
      return this.createSeparator(40, "─");
    });

    return result;
  }
}
