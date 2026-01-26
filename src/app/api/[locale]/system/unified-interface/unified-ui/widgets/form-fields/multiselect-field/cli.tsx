/**
 * MultiSelect Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { ArrayWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { MultiSelectFieldWidgetConfig } from "./types";

export function MultiSelectFieldWidgetInk<TKey extends string>({
  value,
  field,
  context,
}: InkWidgetProps<
  MultiSelectFieldWidgetConfig<TKey, ArrayWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;

  // value is array of selected values
  const selectedValues = Array.isArray(value) ? value : [];
  const selectedOptions = field.options.filter((opt) =>
    selectedValues.includes(opt.value),
  );
  const displayValue =
    selectedOptions.length > 0
      ? selectedOptions.map((opt) => t(opt.label)).join(", ")
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
