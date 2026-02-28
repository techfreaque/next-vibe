/**
 * Boolean Field Widget - CLI Ink implementation
 * Interactive checkbox toggle for terminal mode
 */

import { Box, Text, useInput } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { BooleanWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import {
  type InkWidgetProps,
  isInkFormState,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import {
  useInkWidgetFieldFocused,
  useInkWidgetForm,
  useInkWidgetLocale,
  useInkWidgetResponse,
  useInkWidgetResponseOnly,
  useInkWidgetShowLabels,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { scopedTranslation as cliScopedTranslation } from "../../../../cli/i18n";
import type { FieldUsageConfig } from "../../_shared/types";
import type { BooleanFieldWidgetConfig } from "./types";

export function BooleanFieldWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  BooleanFieldWidgetConfig<TKey, BooleanWidgetSchema, TUsage>
>): JSX.Element {
  const t = useInkWidgetTranslation<TEndpoint>();
  const locale = useInkWidgetLocale();
  const showLabels = useInkWidgetShowLabels();
  const form = useInkWidgetForm();
  const response = useInkWidgetResponse();
  const responseOnly = useInkWidgetResponseOnly();
  const isFocused = useInkWidgetFieldFocused(fieldName);
  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  // Get current value from form state or field default
  const currentValue =
    form && isInkFormState(form) && fieldName
      ? (form.getValue<boolean>(fieldName) ?? field.value ?? false)
      : (field.value ?? false);

  // Toggle on space when focused (interactive mode only)
  useInput(
    (input) => {
      if (input === " " && form && isInkFormState(form) && fieldName) {
        form.setValue(fieldName, !currentValue);
      }
    },
    { isActive: isFocused && !responseOnly },
  );

  // Response-only mode (non-interactive) - just display the value
  if (response && responseOnly) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        {showLabels && field.label && (
          <Text bold>
            {t(field.label)}
            {!field.schema.isOptional() && <Text color="blue"> *</Text>}
          </Text>
        )}
        <Box>
          <Text>{currentValue ? "[✓]" : "[ ]"} </Text>
          {field.checkboxLabel && <Text>{t(field.checkboxLabel)}</Text>}
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Label */}
      {field.label && (
        <Box marginBottom={0}>
          <Text bold color={isFocused ? "cyan" : undefined}>
            {isFocused ? "> " : "  "}
            {t(field.label)}
            {!field.schema.isOptional() && <Text color="blue"> *</Text>}
          </Text>
          {field.description && <Text dimColor> - {t(field.description)}</Text>}
        </Box>
      )}

      {/* Checkbox with toggle hint */}
      <Box>
        <Text color={isFocused ? "cyan" : undefined}>
          {currentValue ? "[✓]" : "[ ]"}{" "}
        </Text>
        {field.checkboxLabel && <Text>{t(field.checkboxLabel)}</Text>}
        {isFocused && (
          <Text dimColor>
            {" "}
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.spaceToToggle",
            )}
          </Text>
        )}
      </Box>
    </Box>
  );
}
