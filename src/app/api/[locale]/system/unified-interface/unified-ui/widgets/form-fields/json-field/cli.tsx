/**
 * JSON Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  useInkWidgetFieldFocused,
  useInkWidgetForm,
  useInkWidgetLocale,
  useInkWidgetResponse,
  useInkWidgetResponseOnly,
  useInkWidgetShowLabels,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { JsonFieldWidgetConfig } from "./types";

export function JsonFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  JsonFieldWidgetConfig<TKey, StringWidgetSchema, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation<TEndpoint>();
  const locale = useInkWidgetLocale();
  const form = useInkWidgetForm();
  const response = useInkWidgetResponse();
  const responseOnly = useInkWidgetResponseOnly();
  const showLabels = useInkWidgetShowLabels();
  const isFocused = useInkWidgetFieldFocused(fieldName);
  const [inputValue, setInputValue] = useState(
    field.value ? JSON.stringify(field.value, null, 2) : "",
  );

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  // Response mode - just display the value
  if (response && responseOnly) {
    const displayValue = field.value
      ? JSON.stringify(field.value, null, 2)
      : "—";
    return (
      <Box flexDirection="column">
        {showLabels && field.label && (
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
          {widgetT("react.widgets.formField.requiresContext")}
        </Text>
      </Box>
    );
  }

  const isRequired = !field.schema.isOptional();
  const errorMessage = form?.errors?.[fieldName];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {field.label && (
        <Box marginBottom={0}>
          <Text bold color={isFocused ? "cyan" : undefined}>
            {isFocused ? "> " : "  "}
            {t(field.label)}
            {isRequired && <Text color="blue"> *</Text>}
          </Text>
          {field.description && <Text dimColor> - {t(field.description)}</Text>}
        </Box>
      )}

      <Box>
        <Text dimColor>{isFocused ? "> " : "  "}</Text>
        <TextInput
          value={inputValue}
          focus={isFocused}
          onChange={(newValue) => {
            setInputValue(newValue);
            try {
              const parsed = JSON.parse(newValue);
              form?.setValue(fieldName, parsed);
            } catch {
              // Invalid JSON, don't update form
            }
          }}
          placeholder={field.placeholder ? t(field.placeholder) : undefined}
        />
      </Box>

      {errorMessage && (
        <Box marginTop={0}>
          <Text color="red">{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
