/**
 * Boolean Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { BooleanWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { BooleanFieldWidgetConfig } from "./types";

export function BooleanFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  BooleanFieldWidgetConfig<TKey, BooleanWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const isChecked = field.value;

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
        <Text>{isChecked ? "[✓]" : "[ ]"} </Text>
        {field.checkboxLabel && <Text>{t(field.checkboxLabel)}</Text>}
      </Box>
    </Box>
  );
}
