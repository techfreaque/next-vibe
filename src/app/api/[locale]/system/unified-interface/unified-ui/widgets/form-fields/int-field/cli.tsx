/**
 * Int Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { NumberWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { IntFieldWidgetConfig } from "./types";

export function IntFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
>({
  field,
  fieldName,
  context,
}: InkWidgetProps<
  TEndpoint,
  IntFieldWidgetConfig<TKey, NumberWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const [inputValue, setInputValue] = useState(String(field.value || ""));

  // Response mode - just display the value
  if (context.response) {
    const displayValue =
      field.value !== null && field.value !== undefined ? field.value : "—";
    return (
      <Box flexDirection="column">
        {field.label && (
          <Text bold>
            {t(field.label)}
            {!field.schema.isOptional() && <Text color="blue"> *</Text>}
          </Text>
        )}
        <Text>{displayValue}</Text>
      </Box>
    );
  }

  // Request mode - show interactive input
  if (!context.form || !fieldName) {
    return (
      <Box>
        <Text color="red">
          {t(
            "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
          )}
        </Text>
      </Box>
    );
  }

  const isRequired = !field.schema.isOptional();
  const error = context.form.errors[fieldName];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {field.label && (
        <Box marginBottom={0}>
          <Text bold>
            {t(field.label)}
            {isRequired && <Text color="blue"> *</Text>}
          </Text>
          {field.description && <Text dimColor> - {t(field.description)}</Text>}
        </Box>
      )}

      <Box>
        <Text dimColor>
          {field.placeholder ? `${t(field.placeholder)}: ` : "> "}
        </Text>
        <TextInput
          value={inputValue}
          onChange={(newValue) => {
            setInputValue(newValue);
            const numValue = parseInt(newValue, 10);
            if (!Number.isNaN(numValue)) {
              context.form?.setValue(fieldName, numValue);
            }
          }}
          placeholder={field.placeholder ? t(field.placeholder) : undefined}
        />
      </Box>

      {error && (
        <Box marginTop={0}>
          <Text color="red">{error}</Text>
        </Box>
      )}
    </Box>
  );
}
