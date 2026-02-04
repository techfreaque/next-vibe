/**
 * Key-Value Widget - Ink implementation
 * Handles KEY_VALUE widget type for key-value pair display
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
import type { KeyValueWidgetConfig, KeyValueWidgetSchema } from "./types";

/**
 * Key-Value Widget - Ink functional component
 *
 * Displays key-value pairs in a structured format.
 */
export function KeyValueWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends KeyValueWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  KeyValueWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const locale = useInkWidgetLocale();
  const { label: labelKey } = field;

  const label = labelKey ? t(labelKey) : undefined;

  // Handle empty/invalid values
  if (
    !field.value ||
    typeof field.value !== "object" ||
    Array.isArray(field.value)
  ) {
    return (
      <Box>
        {label && (
          <Text bold dimColor>
            {label}:{" "}
          </Text>
        )}
        <Text>—</Text>
      </Box>
    );
  }

  const entries = Object.entries(field.value);

  if (entries.length === 0) {
    return (
      <Box>
        {label && (
          <Text bold dimColor>
            {label}:{" "}
          </Text>
        )}
        <Text>—</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={1}>
      {label && (
        <Box marginBottom={1}>
          <Text bold>{label}</Text>
        </Box>
      )}
      {entries.map(([key, val]) => {
        // Try to translate key, fallback to raw key
        const translatedKey = key.startsWith("app.") ? t(key) : key;
        const displayValue =
          typeof val === "number" ? val.toLocaleString(locale) : String(val);

        return (
          <Box key={key}>
            <Text bold dimColor>
              {translatedKey}:{" "}
            </Text>
            <Text>{displayValue}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
