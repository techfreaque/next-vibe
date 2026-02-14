/**
 * Text Widget - CLI Ink implementation
 * Handles TEXT widget type for interactive terminal UI
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
import { extractTextData, formatIfDate, formatText } from "./shared";
import type { TextVariant, TextWidgetConfig, TextWidgetSchema } from "./types";

/**
 * Text Widget - Ink functional component (matches React interface)
 *
 * Displays text with formatting in interactive terminal UI.
 * Mirrors the React TextWidget component.
 */
export function TextWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        TextWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        TUsage,
        TextWidgetConfig<TKey, TextWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const t = useInkWidgetTranslation();
  const locale = useInkWidgetLocale();
  const {
    content,
    fieldType,
    label: labelKey,
    variant,
    emphasis,
    maxLength,
  } = field;
  const label = labelKey ? t(labelKey) : undefined;

  // Map variant to color
  const getColor = (v: TextVariant | undefined): string | undefined => {
    if (!v || v === "default") {
      return undefined;
    }
    const colorMap: Record<TextVariant, string> = {
      default: "white",
      error: "red",
      success: "green",
      warning: "yellow",
      info: "blue",
      muted: "gray",
    };
    return colorMap[v];
  };

  const color = getColor(variant);

  // Handle static content from UI config
  if (content) {
    const translatedContent = t(content);
    const displayText = formatText(translatedContent, maxLength);

    return (
      <Box flexDirection="column">
        {label && <Text bold>{label}</Text>}
        <Text
          color={color}
          bold={emphasis === "bold"}
          italic={emphasis === "italic"}
          underline={emphasis === "underline"}
        >
          {displayText}
        </Text>
      </Box>
    );
  }

  // Handle date formatting
  if (fieldType && field.value) {
    const formattedValue = formatIfDate(field.value, fieldType, locale);
    if (formattedValue) {
      return (
        <Box flexDirection="column">
          {label && <Text bold>{label}</Text>}
          <Text color={color}>{formattedValue}</Text>
        </Box>
      );
    }
  }

  // Extract data using shared logic
  const data = extractTextData(field.value, t);

  // Handle null/empty case
  if (!data) {
    return (
      <Box flexDirection="column">
        {label && <Text bold>{label}</Text>}
        <Text dimColor>—</Text>
      </Box>
    );
  }

  const displayText = formatText(data.text, maxLength);

  // Regular text display
  return (
    <Box flexDirection="column">
      {label && <Text bold>{label}</Text>}
      <Text
        color={color}
        bold={emphasis === "bold"}
        italic={emphasis === "italic"}
        underline={emphasis === "underline"}
      >
        {displayText}
      </Text>
    </Box>
  );
}
