/**
 * Time Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import type { DateWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { TimeFieldWidgetConfig } from "./types";

export function TimeFieldWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
  fieldName,
  context,
}: InkWidgetProps<
  TEndpoint,
  TimeFieldWidgetConfig<TKey, DateWidgetSchema, FieldUsageConfig>
>): JSX.Element {
  const { t } = context;
  const [inputValue, setInputValue] = useState(
    field.value instanceof Date
      ? `${String(field.value.getHours()).padStart(2, "0")}:${String(field.value.getMinutes()).padStart(2, "0")}`
      : "",
  );

  // Response mode - just display the value
  if (context.response) {
    const displayValue =
      field.value instanceof Date
        ? `${String(field.value.getHours()).padStart(2, "0")}:${String(field.value.getMinutes()).padStart(2, "0")}`
        : "—";
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
          {field.placeholder ? `${t(field.placeholder)}: ` : "HH:MM: "}
        </Text>
        <TextInput
          value={inputValue}
          onChange={(newValue) => {
            setInputValue(newValue);
            const [hours, minutes] = newValue.split(":").map(Number);
            if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
              const date = new Date();
              date.setHours(hours, minutes, 0, 0);
              context.form?.setValue(fieldName, date);
            }
          }}
          placeholder={field.placeholder ? t(field.placeholder) : "HH:MM"}
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
