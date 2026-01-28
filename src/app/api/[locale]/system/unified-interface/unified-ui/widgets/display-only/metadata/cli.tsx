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
  TSchema extends MetadataWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  MetadataWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const { title: titleKey } = field;
  const { t } = context;

  const title = titleKey ? t(titleKey) : "Metadata";

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
            <Text>{val}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
