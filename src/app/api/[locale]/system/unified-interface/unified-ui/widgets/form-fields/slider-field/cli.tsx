/**
 * Slider Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { NumberWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { SliderFieldWidgetConfig } from "./types";

export function SliderFieldWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  SliderFieldWidgetConfig<TKey, NumberWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const displayValue =
    field.value !== null && field.value !== undefined ? field.value : "—";

  return (
    <Box flexDirection="column" marginBottom={1}>
      {field.label && (
        <Box marginBottom={0}>
          <Text bold>
            {t(field.label)}
            {!field.schema.isOptional() && <Text color="blue"> *</Text>}
          </Text>
          {field.description && <Text dimColor> - {t(field.description)}</Text>}
        </Box>
      )}

      <Box>
        <Text>{displayValue}</Text>
      </Box>
    </Box>
  );
}
