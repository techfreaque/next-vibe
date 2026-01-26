/**
 * Icon Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { IconFieldWidgetConfig } from "./types";

export function IconFieldWidgetInk<TKey extends string>({
  value,
  field,
  context,
}: InkWidgetProps<
  IconFieldWidgetConfig<TKey, StringWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const displayValue = value ? String(value) : "—";

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
