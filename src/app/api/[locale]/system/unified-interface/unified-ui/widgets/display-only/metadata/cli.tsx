/**
 * Metadata Widget - Ink implementation
 * Handles METADATA widget type for metadata display
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import type { MetadataWidgetConfig, MetadataWidgetSchema } from "./types";

/**
 * Metadata Widget - Ink functional component
 *
 * Displays metadata key-value pairs or simple text.
 */
export function MetadataWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        MetadataWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        MetadataWidgetConfig<TKey, MetadataWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field, context } = props;
  const { title: titleKey } = field;
  const { t } = context;

  const title = titleKey ? t(titleKey) : "Metadata";

  // Handle string values
  if (typeof field.value === "string") {
    return (
      <Box flexDirection="column" marginY={1}>
        <Text bold dimColor>
          {title}
        </Text>
        <Box marginLeft={2}>
          <Text>{field.value}</Text>
        </Box>
      </Box>
    );
  }

  // Handle null/undefined
  if (!field.value) {
    return (
      <Box flexDirection="column" marginY={1}>
        <Text bold dimColor>
          {title}
        </Text>
        <Box marginLeft={2}>
          <Text dimColor>—</Text>
        </Box>
      </Box>
    );
  }

  // Handle object with key-value pairs
  const entries = Object.entries(field.value);

  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold dimColor>
        {title}
      </Text>
      <Box flexDirection="column" marginLeft={2}>
        {entries.map(([key, val]) => (
          <Box key={key}>
            <Text dimColor>{key}: </Text>
            <Text>{String(val)}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
