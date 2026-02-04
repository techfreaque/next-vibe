/**
 * Link Widget - CLI Ink implementation
 * Handles LINK widget type for interactive terminal UI
 */

import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { FieldUsageConfig } from "../../_shared/types";
import { extractLinkData } from "./shared";
import type { LinkWidgetConfig, LinkWidgetSchema } from "./types";

/**
 * Link Widget - Ink functional component (matches React interface)
 *
 * Displays hyperlinks in interactive terminal UI.
 * Mirrors the React LinkWidget component exactly.
 */
export function LinkWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        LinkWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        LinkWidgetConfig<TKey, LinkWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const t = useInkWidgetTranslation();
  const { href, text } = field;

  // Priority 1: Dynamic value from field.value
  if (field.value !== null && field.value !== undefined && field.value !== "") {
    const data = extractLinkData(field.value);

    if (data) {
      const { url, text: dataText } = data;

      // For CLI, we render links in a readable format
      // Format: text (url) or just url if text equals url
      if (dataText === url) {
        return <Text color="blue">{url}</Text>;
      }

      // Format: text (url)
      return (
        <>
          <Text color="blue">{dataText}</Text>
          <Text dimColor> ({url})</Text>
        </>
      );
    }
  }

  // Priority 2: Static text and href props
  if (text && href) {
    const translatedText = t(text);
    // For static links, just show the text
    return <Text color="blue">{translatedText}</Text>;
  }

  // Priority 3: No data available
  return (
    <Text dimColor>
      {t(
        "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
      )}
    </Text>
  );
}
