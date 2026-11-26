/**
 * Number Field Widget - Platform-agnostic React implementation
 * Handles NUMBER and INT field types
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Div } from "next-vibe/ui/components/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Info } from "next-vibe/ui/components/icons/Info";
import { NumberInput } from "next-vibe/ui/components/number-input";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";
import { z } from "zod";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import { cn } from "../../../_shared/cn";
import type { ReactFormFieldProps } from "../../../_shared/react-types";
import type { NumberWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "../../../_shared/use-widget-context";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "../../../hooks/i18n";
import { getTheme } from "../_shared/constants";
import { useFormFieldDescriptionStyle } from "../_shared/description-style";
import { FieldInfoTooltip } from "../_shared/field-info-tooltip";
import { renderPrefillDisplay } from "../_shared/prefill";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import { DecimalInput } from "./decimal-input";
import type { DecimalPresentation } from "./decimal-value";
import type { NumberFieldWidgetConfig } from "./types";

/** Read constraints on the number inside optional, nullable and default field schemas. */
function numberSchema(schema: z.ZodType | undefined): z.ZodNumber | undefined {
  let current = schema;
  for (let depth = 0; depth < 6 && current; depth++) {
    if (current instanceof z.ZodNumber) {
      return current;
    }
    const inner = Reflect.get(current.def, "innerType");
    current = inner instanceof z.ZodType ? inner : undefined;
  }
  return undefined;
}

const PERCENT_FIELD_NAME = /(percent|percentage|pct)$/i;

/**
 * `z.number().int()` reports the safe-integer range as its bounds: that is no
 * real limit, and an empty stepper must not start at -9007199254740991.
 */
function isRealBound(bound: number): boolean {
  return Number.isFinite(bound) && Math.abs(bound) < Number.MAX_SAFE_INTEGER;
}

export function NumberFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends (TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never),
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
  presentation: presentationProp,
  currency,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  NumberFieldWidgetConfig<TKey, TSchema, TUsage>
> & {
  presentation?: DecimalPresentation;
  currency?: string | null;
}): JSX.Element {
  const { t: tField } = useWidgetContext();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const isDisabled = useWidgetDisabled();

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  const theme = getTheme(field.theme);
  const descriptionStyle = useFormFieldDescriptionStyle(theme.descriptionStyle);

  if (!form || !fieldName) {
    return <Div>{widgetT("widgets.formField.requiresContext")}</Div>;
  }
  // Percent fields (`vatPercent`, `discountPct`, `ratePercentage`) get a
  // percent input with a % suffix instead of a stepper that starts at 0.
  const presentation =
    presentationProp ??
    (PERCENT_FIELD_NAME.test(fieldName) ? "percent" : undefined);
  const isRequired = !field.schema.isOptional();
  // An explicit field config wins; otherwise fall back to what the schema
  // already declares, so `.min(1)` clamps the stepper without being restated.
  const numeric = numberSchema(field.schema);
  const lowerBound = numeric?.minValue;
  const upperBound = numeric?.maxValue;
  const effectiveMin =
    field.min ??
    (typeof lowerBound === "number" && isRealBound(lowerBound)
      ? lowerBound
      : undefined);
  const effectiveMax =
    field.max ??
    (typeof upperBound === "number" && isRealBound(upperBound)
      ? upperBound
      : undefined);
  const allowDecimals = numeric?.isInt === false;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField, fieldState }) => {
        const validationState = getFieldValidationState(
          formField.value,
          fieldState.error,
          isRequired,
        );
        const styleClassName = getFieldStyleClassName(validationState, theme);
        const { style } = theme;

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, field.className)}
          >
            <Div className="flex flex-col gap-1">
              <Div className="flex flex-row items-center gap-1.5">
                <FormLabel
                  className={cn(
                    styleClassName.labelClassName,
                    "flex items-center gap-1.5",
                  )}
                >
                  <Span>{field.label && tField(field.label)}</Span>
                  {field.label && style === "asterisk" && isRequired && (
                    <Span className="text-info font-bold">*</Span>
                  )}
                </FormLabel>
                {!presentationProp &&
                  field.description &&
                  descriptionStyle === "tooltip" && (
                    <FieldInfoTooltip
                      text={tField(field.description)}
                      label={field.label ? tField(field.label) : undefined}
                    />
                  )}
                {style === "badge" && isRequired && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-info/10 text-info border-info/20"
                  >
                    {widgetT("widgets.formFields.common.required")}
                  </Badge>
                )}
              </Div>
              {!presentationProp &&
                field.description &&
                descriptionStyle === "inline" && (
                  <Div className={styleClassName.inlineDescriptionClassName}>
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <Span>{tField(field.description)}</Span>
                  </Div>
                )}
            </Div>

            <FormControl>
              {field.prefillDisplay &&
              formField.value &&
              !fieldState.isDirty ? (
                renderPrefillDisplay(
                  formField.value,
                  field.label,
                  field.prefillDisplay,
                  tField,
                )
              ) : presentation ? (
                <DecimalInput
                  ref={formField.ref}
                  name={formField.name}
                  aria-label={field.label && tField(field.label)}
                  aria-invalid={fieldState.invalid}
                  locale={locale}
                  presentation={presentation}
                  suffix={
                    presentation === "percent" ? "%" : (currency ?? undefined)
                  }
                  value={formField.value}
                  onChange={formField.onChange}
                  onBlur={formField.onBlur}
                  disabled={isDisabled || field.disabled || field.readonly}
                  className={styleClassName.inputClassName}
                />
              ) : (
                <NumberInput
                  ref={formField.ref}
                  aria-label={field.label && tField(field.label)}
                  locale={locale}
                  name={formField.name}
                  value={formField.value ?? effectiveMin ?? 0}
                  onChange={(value) => formField.onChange(value)}
                  onBlur={formField.onBlur}
                  min={effectiveMin}
                  max={effectiveMax}
                  step={field.step}
                  allowDecimals={allowDecimals}
                  disabled={isDisabled || field.disabled || field.readonly}
                  className={styleClassName.inputClassName}
                />
              )}
            </FormControl>

            {fieldState.error && (
              <Div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage t={tField} />
              </Div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export default NumberFieldWidget;
