/**
 * Markdown Widget Renderer
 * Handles MARKDOWN widget type for CLI display
 * Converts markdown to plain text with basic ANSI formatting
 */

import { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { WidgetInput } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/types";
import {
  extractMarkdownData,
  type ProcessedMarkdown,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/widgets/logic/markdown";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { WidgetRenderContext } from "../core/types";

export class MarkdownWidgetRenderer extends BaseWidgetRenderer {
  canRender(widgetType: WidgetType): boolean {
    return widgetType === WidgetType.MARKDOWN;
  }

  render(input: WidgetInput, context: WidgetRenderContext): string {
    const { value } = input;
    const t = context.t;

    // Extract data using shared logic
    const data = extractMarkdownData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderMarkdown(data, context);
  }

  private renderMarkdown(
    data: ProcessedMarkdown,
    context: WidgetRenderContext,
  ): string {
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
  private convertMarkdownToPlainText(
    content: string,
    context: WidgetRenderContext,
  ): string {
    let result = content;

    // Convert headings (# Heading)
    result = result.replace(/^#{1,6}\s+(.+)$/gm, (match, heading) => {
      return this.styleText(heading, "bold", context);
    });

    // Convert bold (**text** or __text__)
    result = result.replace(/(\*\*|__)(.+?)\1/g, (match, marker, text) => {
      return this.styleText(text, "bold", context);
    });

    // Convert italic (*text* or _text_)
    result = result.replace(/(\*|_)(.+?)\1/g, (match, marker, text) => {
      return this.styleText(text, "dim", context);
    });

    // Convert inline code (`code`)
    result = result.replace(/`([^`]+)`/g, (match, code) => {
      return this.styleText(code, "blue", context);
    });

    // Convert code blocks (```code```)
    result = result.replace(/```[\s\S]*?```/g, (match) => {
      // Remove the backticks
      const code = match.replace(/```/g, "");
      return this.styleText(code, "blue", context);
    });

    // Convert unordered lists (- item or * item)
    result = result.replace(/^[*-]\s+(.+)$/gm, (_match, item) => {
      const bullet = context.options.useEmojis ? "•" : "-";
      // eslint-disable-next-line i18next/no-literal-string
      return `${bullet} ${item}`;
    });

    // Convert ordered lists (1. item)
    result = result.replace(/^\d+\.\s+(.+)$/gm, (match, _item) => {
      return match; // Keep numbered lists as-is
    });

    // Convert links [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      // For CLI, just show the text with URL in dim
      const styledText = this.styleText(text, "blue", context);
      const styledUrl = this.styleText(`(${url})`, "dim", context);
      // eslint-disable-next-line i18next/no-literal-string
      return `${styledText} ${styledUrl}`;
    });

    // Convert horizontal rules (--- or ***)
    result = result.replace(/^(\*{3,}|-{3,})$/gm, () => {
      return this.createSeparator(40, "─");
    });

    return result;
  }
}
