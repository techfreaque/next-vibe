/**
 * Range Slider Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import {
  useInkWidgetShowLabels,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { RangeSliderFieldWidgetConfig } from "./types";

export function RangeSliderFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  RangeSliderFieldWidgetConfig<
    TKey,
    z.ZodOptional<
      z.ZodObject<{
        min: z.ZodOptional<EnumWidgetSchema>;
        max: z.ZodOptional<EnumWidgetSchema>;
      }>
    >,
    TUsage
  >
>): JSX.Element {
  const t = useInkWidgetTranslation<TEndpoint>();
  const showLabels = useInkWidgetShowLabels();
  const displayValue =
    field.value &&
    typeof field.value === "object" &&
    (field.value.min !== undefined || field.value.max !== undefined)
      ? `${field.value.min ?? "—"} - ${field.value.max ?? "—"}`
      : "—";

  return (
    <Box flexDirection="column" marginBottom={1}>
      {showLabels && field.label && (
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
