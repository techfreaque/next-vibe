/**
 * Select Field Widget - CLI Ink implementation
 * Interactive select with arrow key cycling for terminal mode
 */

import { Box, Text, useInput } from "ink";
import type { JSX } from "react";

import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
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
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { FieldUsageConfig } from "../../_shared/types";
import type { SelectFieldWidgetConfig } from "./types";

export function SelectFieldWidgetInk<
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
  SelectFieldWidgetConfig<TKey, EnumWidgetSchema, TUsage>
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
      ? (form.getValue<string | number>(fieldName) ?? field.value)
      : field.value;

  const enabledOptions = field.options.filter(
    (opt: {
      value: string | number;
      label: string;
      labelParams?: Record<string, string | number>;
      disabled?: boolean;
    }) => !opt.disabled,
  );

  // Cycle through options with left/right arrows when focused
  useInput(
    // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
    (_, key) => {
      if (
        (key.leftArrow || key.rightArrow) &&
        form &&
        isInkFormState(form) &&
        fieldName &&
        enabledOptions.length > 0
      ) {
        const currentIndex = enabledOptions.findIndex(
          (opt: { value: string | number }) => opt.value === currentValue,
        );
        const direction = key.rightArrow ? 1 : -1;
        const nextIndex =
          (currentIndex + direction + enabledOptions.length) %
          enabledOptions.length;
        form.setValue(fieldName, enabledOptions[nextIndex].value);
      }
    },
    { isActive: isFocused && !responseOnly },
  );

  // Find selected option label
  const selectedOption = field.options.find(
    (opt: { value: string | number }) => opt.value === currentValue,
  );
  const displayValue = selectedOption
    ? t(selectedOption.label)
    : currentValue
      ? String(currentValue)
      : "—";

  // Response-only mode (non-interactive) - just display
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
          <Text>{displayValue}</Text>
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

      {/* Selected value with navigation hint */}
      <Box>
        <Text color={isFocused ? "cyan" : undefined}>
          {"  "}
          {displayValue}
        </Text>
        {isFocused && (
          <Text dimColor>
            {" "}
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.arrowsToChange",
            )}
          </Text>
        )}
      </Box>
    </Box>
  );
}
