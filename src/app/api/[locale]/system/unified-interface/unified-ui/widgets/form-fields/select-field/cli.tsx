/**
 * Select Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { SelectFieldWidgetConfig } from "./types";

export function SelectFieldWidgetInk<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  SelectFieldWidgetConfig<TKey, EnumWidgetSchema, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation();

  // Find selected option
  const selectedOption = field.options.find(
    (opt: {
      value: string | number;
      label: string;
      labelParams?: Record<string, string | number>;
      disabled?: boolean;
    }) => opt.value === field.value,
  );
  const displayValue = selectedOption ? t(selectedOption.label) : "—";

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
