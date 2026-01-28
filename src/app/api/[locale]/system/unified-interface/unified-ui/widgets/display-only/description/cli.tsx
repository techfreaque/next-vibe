/**
 * Description Widget - Ink implementation
 * Handles DESCRIPTION widget type for descriptive text
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import { extractDescriptionData } from "./shared";
import type { DescriptionWidgetConfig, DescriptionWidgetSchema } from "./types";

/**
 * Description Widget - Ink functional component
 *
 * Renders descriptive text with muted styling.
 */
export function DescriptionWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends DescriptionWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  DescriptionWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  // Extract data using shared logic with translation context
  const data = extractDescriptionData(field.value, context);

  // Handle null case
  if (!data) {
    return (
      <Box>
        <Text dimColor>—</Text>
      </Box>
    );
  }

  const { text } = data;

  return (
    <Box>
      <Text dimColor>{text}</Text>
    </Box>
  );
}
