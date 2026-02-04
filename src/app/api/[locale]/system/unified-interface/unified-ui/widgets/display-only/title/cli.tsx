/**
 * Title Widget - CLI Ink implementation
 * Handles TITLE widget type for interactive terminal UI
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import {
  useInkWidgetLocale,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { FieldUsageConfig } from "../../_shared/types";
import { formatIfDate } from "../text/shared";
import { extractTitleData } from "./shared";
import type { TitleWidgetConfig, TitleWidgetSchema } from "./types";

/**
 * Title Widget - Ink functional component (matches React interface)
 *
 * Displays headings with color-coded styling in interactive terminal UI.
 * Mirrors the React TitleWidget component exactly.
 */
export function TitleWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        TitleWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        TitleWidgetConfig<TKey, TitleWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const t = useInkWidgetTranslation();
  const locale = useInkWidgetLocale();
  const { content, level: configLevel, fieldType } = field;

  // Level comes from field.ui (config), not from data
  const level = configLevel ?? 2;

  // Handle static content from UI config
  if (content) {
    const translatedContent = t(content);
    return renderTitle(translatedContent, undefined, level);
  }

  // Handle date formatting if fieldType is DATE or DATETIME
  const dateFormatted = formatIfDate(field.value, fieldType, locale);
  if (dateFormatted) {
    return renderTitle(dateFormatted, undefined, level);
  }

  // value is properly typed from schema - no assertions needed
  // Extract data using shared logic with translation context
  const data = extractTitleData(field.value, { t });

  // Handle null case
  if (!data) {
    return <Text dimColor>—</Text>;
  }

  // Render using extracted data with level from config
  return renderTitle(data.text, data.subtitle, level);
}

/**
 * Render title with level-based styling and optional subtitle.
 * Higher level headings (1-3) use bold styling for prominence.
 * Lower level headings (4-6) use normal weight.
 */
function renderTitle(
  text: string,
  subtitle: string | undefined,
  level: 1 | 2 | 3 | 4 | 5 | 6,
): JSX.Element {
  // Apply bold styling for prominent headings (levels 1-3)
  const isBold = level <= 3;

  return (
    <Box flexDirection="column">
      <Text bold={isBold}>{text}</Text>
      {subtitle && <Text dimColor>{subtitle}</Text>}
    </Box>
  );
}
