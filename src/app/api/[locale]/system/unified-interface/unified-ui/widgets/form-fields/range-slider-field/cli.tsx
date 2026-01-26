/**
 * Range Slider Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { RangeSliderFieldWidgetConfig } from "./types";

export function RangeSliderFieldWidgetInk<TKey extends string>({
  value,
  field,
  context,
}: InkWidgetProps<
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
  const rangeValue =
    value && typeof value === "object"
      ? (value as { min?: string | number; max?: string | number })
      : {};
  const displayValue =
    rangeValue.min !== undefined || rangeValue.max !== undefined
      ? `${rangeValue.min ?? "—"} - ${rangeValue.max ?? "—"}`
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
