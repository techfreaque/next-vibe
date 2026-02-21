/**
 * Description Widget - Ink implementation
 * Handles DESCRIPTION widget type for descriptive text
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { FieldUsageConfig } from "../../_shared/types";
import type { DescriptionWidgetConfig } from "./types";

/**
 * Description Widget - Ink functional component
 *
 * Renders descriptive text with muted styling.
 */
export function DescriptionWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  DescriptionWidgetConfig<TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const t = useInkWidgetTranslation();

  // Handle null case
  if (!field.value) {
    return (
      <Box>
        <Text dimColor>—</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* field.value is typed as inferred schema output; TSchema extends StringWidgetSchema so it is a string */}
      <Text dimColor>{t(field.value as string)}</Text>
    </Box>
  );
}
