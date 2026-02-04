/**
 * Text Field Widget - CLI Ink implementation
 * Handles TEXT, EMAIL, URL, TEL field types for interactive terminal mode
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import {
  type InkWidgetProps,
  isInkFormState,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useInkWidgetForm,
  useInkWidgetResponse,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { TextFieldWidgetConfig } from "./types";

/**
 * Text Field Widget - Ink functional component (matches React interface)
 *
 * Interactive text input field for terminal UI.
 * Mirrors the React TextFieldWidget component structure.
 */
export function TextFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  TextFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const form = useInkWidgetForm();
  const response = useInkWidgetResponse();
  const [inputValue, setInputValue] = useState(field.value ? field.value : "");

  // Response mode - just display the value
  if (response) {
    const displayValue = field.value ? field.value : "—";
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

  // Type guard to ensure we have InkFormState
  if (!isInkFormState(form)) {
    return (
      <Box>
        <Text color="red">
          {t(
            "app.api.system.unifiedInterface.cli.widgets.formField.invalidFormType",
          )}
        </Text>
      </Box>
    );
  }

  const isRequired = !field.schema.isOptional();
  const errorMessage = form.errors[fieldName];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Label with required indicator */}
      {field.label && (
        <Box marginBottom={0}>
          <Text bold>
            {t(field.label)}
            {isRequired && <Text color="blue"> *</Text>}
          </Text>
          {field.description && <Text dimColor> - {t(field.description)}</Text>}
        </Box>
      )}

      {/* Input field */}
      <Box>
        <Text dimColor>
          {field.placeholder ? `${t(field.placeholder)}: ` : "> "}
        </Text>
        <TextInput
          value={inputValue}
          onChange={(newValue) => {
            setInputValue(newValue);
            if (form) {
              form.setValue(fieldName, newValue);
            }
          }}
          placeholder={field.placeholder ? t(field.placeholder) : undefined}
        />
      </Box>

      {/* Error message */}
      {errorMessage && (
        <Box marginTop={0}>
          <Text color="red">{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
