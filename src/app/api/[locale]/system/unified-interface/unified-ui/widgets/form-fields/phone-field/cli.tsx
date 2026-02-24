/**
 * Phone Field Widget - CLI Ink implementation
 */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import {
  useInkWidgetForm,
  useInkWidgetLocale,
  useInkWidgetResponse,
  useInkWidgetShowLabels,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { type InkWidgetProps, isInkFormState } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { PhoneFieldWidgetConfig } from "./types";

export function PhoneFieldWidgetInk<
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  PhoneFieldWidgetConfig<TKey, StringWidgetSchema, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation<TEndpoint>();
  const locale = useInkWidgetLocale();
  const form = useInkWidgetForm();
  const response = useInkWidgetResponse();
  const showLabels = useInkWidgetShowLabels();
  const [inputValue, setInputValue] = useState(field.value ? field.value : "");

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  // Response mode - just display the value
  if (response) {
    const displayValue = field.value ? field.value : "—";
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

  if (!isInkFormState(form)) {
    return (
      <Box>
        <Text color="red">
          {widgetT(
            "cli.vibe.endpoints.renderers.cliUi.widgets.common.invalidFormType",
          )}
        </Text>
      </Box>
    );
  }

  const isRequired = !field.schema.isOptional();
  const errorMessage = form.errors[fieldName];

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
            if (form) {
              form.setValue(fieldName, newValue);
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
