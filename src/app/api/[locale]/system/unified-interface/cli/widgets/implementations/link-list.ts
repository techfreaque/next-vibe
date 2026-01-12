/**
 * Link List Widget Renderer
 *
 * Handles LINK_LIST widget type for CLI display.
 * Displays a list of links with optional title and description.
 * Each link shows:
 * - Icon or bullet point
 * - Link title or URL (blue)
 * - URL in parentheses (if title differs from URL)
 * - Optional description
 *
 * Pure rendering implementation - ANSI codes, styling, layout only.
 * All data extraction logic imported from shared.
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractLinkListData,
  type LinkItem,
  type ProcessedLinkList,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/link-list";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class LinkListWidgetRenderer extends BaseWidgetRenderer<
  typeof WidgetType.LINK_LIST
> {
  readonly widgetType = WidgetType.LINK_LIST;

  /**
   * Render link list with optional title and description header.
   * Uses shared extraction logic to process the link list data before rendering.
   */
  render(props: CLIWidgetProps<typeof WidgetType.LINK_LIST, string>): string {
    const { value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractLinkListData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderLinkList(data, context);
  }

  /**
   * Render link list with optional title and description header.
   * - Title (bold) on first line if present
   * - Description (wrapped) on following lines if present
   * - Each link item rendered with icon/bullet, title/URL, and optional description
   */
  private renderLinkList(
    data: ProcessedLinkList,
    context: WidgetRenderContext,
  ): string {
    const { items, title, description } = data;
    const indent = this.createIndent(context.depth, context);
    const result: string[] = [];

    // Render title if available
    if (title) {
      const styledTitle = this.styleText(title, "bold", context);
      result.push(`${indent}${styledTitle}`);
      result.push(""); // Empty line for spacing
    }

    // Render description if available
    if (description) {
      const wrappedDescription = this.wrapText(
        description,
        context.options.maxWidth - indent.length,
        indent,
      );
      result.push(`${indent}${wrappedDescription}`);
      result.push(""); // Empty line for spacing
    }

    // Render each link item
    for (const item of items) {
      const linkLine = this.renderLinkItem(item, indent, context);
      result.push(linkLine);
    }

    return result.join("\n");
  }

  /**
   * Render a single link item with styling.
   * - Icon/bullet + title/URL (blue styled)
   * - URL in parentheses (dimmed) if title differs from URL
   * - Optional description prefixed with dash
   * All parts joined on one line with spaces.
   */
  private renderLinkItem(
    item: LinkItem,
    indent: string,
    context: WidgetRenderContext,
  ): string {
    const { url, title, description, icon } = item;

    // Build the link display text
    const iconPrefix = context.options.useEmojis && icon ? `${icon} ` : "• ";
    const displayText = title || url;

    const parts: string[] = [];

    // Add icon and title/url
    const styledText = this.styleText(
      `${iconPrefix}${displayText}`,
      "blue",
      context,
    );
    parts.push(styledText);

    // Add URL in parentheses if different from title
    if (title && title !== url) {
      const styledUrl = this.styleText(`(${url})`, "dim", context);
      parts.push(styledUrl);
    }

    // Add description if available
    if (description) {
      // eslint-disable-next-line i18next/no-literal-string
      parts.push(`- ${description}`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${indent}${parts.join(" ")}`;
  }
}
