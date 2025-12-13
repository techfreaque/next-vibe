/**
 * Link Widget Renderer
 * Handles LINK widget type for CLI display
 */

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  extractLinkData,
  type ProcessedLink,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/logic/link";

import { BaseWidgetRenderer } from "../core/base-renderer";
import type { CLIWidgetProps, WidgetRenderContext } from "../core/types";

export class LinkWidgetRenderer extends BaseWidgetRenderer<typeof WidgetType.LINK> {
  readonly widgetType = WidgetType.LINK;

  render(props: CLIWidgetProps<typeof WidgetType.LINK>): string {
    const { value, context } = props;
    const t = context.t;

    // Extract data using shared logic
    const data = extractLinkData(value);

    // Handle null case
    if (!data) {
      return context.renderEmptyState(
        t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        ),
      );
    }

    // Render using extracted data
    return this.renderLink(data, context);
  }

  private renderLink(
    data: ProcessedLink,
    context: WidgetRenderContext,
  ): string {
    const { url, text } = data;

    // For CLI, we render links in a readable format
    // Format: text (url) or just url if text equals url
    if (text === url) {
      return this.styleText(url, "blue", context);
    }

    // Format: text (url)
    const styledText = this.styleText(text, "blue", context);
    const styledUrl = this.styleText(`(${url})`, "dim", context);

    // eslint-disable-next-line i18next/no-literal-string
    return `${styledText} ${styledUrl}`;
  }
}
