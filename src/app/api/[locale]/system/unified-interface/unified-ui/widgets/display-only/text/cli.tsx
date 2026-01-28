/**
 * Text Widget - CLI Ink implementation
 * Handles TEXT widget type for interactive terminal UI
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

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
  TSchema extends TextWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget" | "primitive",
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  TextWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const {
    content,
    fieldType,
    label: labelKey,
    variant,
    emphasis,
    maxLength,
    format,
    href,
  } = field;
  const label = labelKey ? context.t(labelKey) : undefined;

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
    const translatedContent = context.t(content);
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
    const formattedValue = formatIfDate(field.value, fieldType, context.locale);
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
  const data = extractTextData(field.value, context);

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

  // Handle link format
  if (format === "link" && href) {
    return (
      <Box flexDirection="column">
        {label && <Text bold>{label}</Text>}
        <Text color="blue" underline>
          {displayText}
        </Text>
      </Box>
    );
  }

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
