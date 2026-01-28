/**
 * Range Slider Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { RangeSliderFieldWidgetConfig } from "./types";

export function RangeSliderFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  RangeSliderFieldWidgetConfig<
    TKey,
    z.ZodOptional<
      z.ZodObject<{
        min: z.ZodOptional<EnumWidgetSchema>;
        max: z.ZodOptional<EnumWidgetSchema>;
      }>
    >,
    FieldUsageConfig
  >
>): JSX.Element {
  const { t } = context;
  const displayValue =
    field.value &&
    typeof field.value === "object" &&
    (field.value.min !== undefined || field.value.max !== undefined)
      ? `${field.value.min ?? "—"} - ${field.value.max ?? "—"}`
      : "—";

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
