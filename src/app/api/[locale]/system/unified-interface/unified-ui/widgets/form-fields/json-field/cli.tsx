/**
 * JSON Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { JsonFieldWidgetConfig } from "./types";
import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";

export function JsonFieldWidgetInk<TKey extends string>({
  value,
  field,
  fieldName,
  context,
  form,
}: InkWidgetProps<
  JsonFieldWidgetConfig<TKey, StringWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const [inputValue, setInputValue] = useState(
    value ? JSON.stringify(value, null, 2) : "",
  );

  // Response mode - just display the value
  if (context.response) {
    const displayValue = value ? JSON.stringify(value, null, 2) : "—";
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
  if (!form || !fieldName) {
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
  const error = form.errors[fieldName];

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
            try {
              const parsed = JSON.parse(newValue);
              form.setValue(fieldName, parsed);
            } catch {
              // Invalid JSON, don't update form
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
