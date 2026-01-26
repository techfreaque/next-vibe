/**
 * Filter Pills Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { FilterPillsFieldWidgetConfig } from "./types";
import type { EnumWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";

export function FilterPillsFieldWidgetInk<TKey extends string>({
  value,
  field,
  context,
}: InkWidgetProps<
  FilterPillsFieldWidgetConfig<TKey, EnumWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;

  // Find selected option
  const selectedOption = field.options.find((opt) => opt.value === value);
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
