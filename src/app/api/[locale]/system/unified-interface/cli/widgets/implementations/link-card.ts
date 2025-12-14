/**
 * Link Card Widget Renderer
 * Handles LINK_CARD widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractLinkCardData,
  getDisplayUrl,
  type ProcessedLinkCard,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/link-card";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class LinkCardWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.LINK_CARD> {
  readonly widgetType = WidgetType.LINK_CARD;

  render(props: CLIWidgetProps<typeof WidgetType.LINK_CARD>): string {
    const { value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractLinkCardData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderLinkCard(data, context);
  }

  private renderLinkCard(
    data: ProcessedLinkCard,
    context: WidgetRenderContext,
  ): string {
    const { title, url, description, icon, metadata } = data;
    const indent = this.createIndent(context.depth, context);
    const result: string[] = [];

    // Render icon if available
    const iconPrefix = context.options.useEmojis && icon ? `${icon} ` : "";

    // Render title
    const styledTitle = this.styleText(
      `${iconPrefix}${title}`,
      "bold",
      context,
    );
    result.push(`${indent}${styledTitle}`);

    // Render URL
    const displayUrl = getDisplayUrl(url);
    const styledUrl = this.styleText(displayUrl, "blue", context);
    // eslint-disable-next-line i18next/no-literal-string
    result.push(`${indent}  ${styledUrl}`);

    // Render description if available
    if (description) {
      const wrappedDescription = this.wrapText(
        description,
        context.options.maxWidth - indent.length - 2,
        `${indent}  `,
      );
      result.push(`${indent}  ${wrappedDescription}`);
    }

    // Render metadata if available
    if (metadata && Object.keys(metadata).length > 0) {
      for (const [key, value] of Object.entries(metadata)) {
        const styledKey = this.styleText(`${key}:`, "dim", context);
        // eslint-disable-next-line i18next/no-literal-string
        result.push(`${indent}  ${styledKey} ${value}`);
      }
    }

    return result.join("\n");
  }
}
