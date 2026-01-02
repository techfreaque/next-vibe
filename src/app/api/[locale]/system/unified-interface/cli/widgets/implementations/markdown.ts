/**
 * Markdown Widget Renderer
 * Handles MARKDOWN widget type for CLI display
 * Converts markdown to plain text with basic ANSI formatting
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
   * Convert markdown to plain text with basic ANSI formatting
   * Supports: headings, bold, italic, code blocks, inline code, lists
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
