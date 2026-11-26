/**
 * DateTime Field Widget - Platform-agnostic React implementation
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { DatePicker } from "next-vibe/ui/components/date-picker";
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
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import { cn } from "../../../_shared/cn";
import type { ReactFormFieldProps } from "../../../_shared/react-types";
import type { DateWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "../../../_shared/use-widget-context";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "../../../hooks/i18n";
import { getTheme } from "../_shared/constants";
import { parseFormDate } from "../_shared/date-value";
import { FieldInfoTooltip } from "../_shared/field-info-tooltip";
import { renderPrefillDisplay } from "../_shared/prefill";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { DateTimeFieldWidgetConfig } from "./types";

/** HH:MM in local time for the time input. */
function toTimeValue(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function startOfDay(date: Date | undefined): Date | undefined {
  if (!date) {
    return undefined;
  }
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

/** A copy of `date` at the "HH:MM" time, or undefined for a partial value. */
function applyTime(date: Date, time: string): Date | undefined {
  const match = /^(\d{2}):(\d{2})/.exec(time);
  if (!match) {
    return undefined;
  }
  const next = new Date(date);
  next.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return next;
}

/** The picked day, keeping the time already chosen (midnight when none). */
function withTime(day: Date, current: Date | undefined): Date {
  const next = new Date(day);
  next.setHours(current?.getHours() ?? 0, current?.getMinutes() ?? 0, 0, 0);
  return next;
}

export function DateTimeFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends (TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never),
  TSchema extends DateWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  DateTimeFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const { t: tField } = useWidgetContext();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const isDisabled = useWidgetDisabled();

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  if (!form || !fieldName) {
    return <Div>{widgetT("widgets.formField.requiresContext")}</Div>;
  }
  const theme = getTheme(field.theme);
  const descriptionStyle = theme.descriptionStyle;
  const isRequired = !field.schema.isOptional();

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
                {field.description && descriptionStyle === "tooltip" && (
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
              {field.description && descriptionStyle === "inline" && (
                <Div className={styleClassName.inlineDescriptionClassName}>
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <Span>{tField(field.description)}</Span>
                </Div>
              )}
            </Div>

            {field.prefillDisplay && formField.value && !fieldState.isDirty ? (
              <FormControl>
                {renderPrefillDisplay(
                  formField.value,
                  field.label,
                  field.prefillDisplay,
                  tField,
                )}
              </FormControl>
            ) : (
              <Div className="flex min-w-0 gap-2">
                <FormControl>
                  <DatePicker
                    className="min-w-0 flex-1"
                    value={parseFormDate(formField.value)}
                    onChange={(date) =>
                      formField.onChange(
                        date
                          ? withTime(date, parseFormDate(formField.value))
                          : null,
                      )
                    }
                    ref={formField.ref}
                    onBlur={formField.onBlur}
                    locale={locale}
                    aria-label={field.label && tField(field.label)}
                    minDate={startOfDay(field.minDateTime)}
                    maxDate={field.maxDateTime}
                    disabled={isDisabled || field.disabled || field.readonly}
                    inputClassName={styleClassName.inputClassName}
                    name={formField.name}
                  />
                </FormControl>
                <Input
                  type="time"
                  aria-label={widgetT("widgets.formFields.common.time")}
                  value={toTimeValue(parseFormDate(formField.value))}
                  onChange={(e) => {
                    const current = parseFormDate(formField.value);
                    const next = applyTime(
                      current ?? new Date(new Date().setHours(0, 0, 0, 0)),
                      e.target.value,
                    );
                    if (next) {
                      formField.onChange(next);
                    }
                  }}
                  onBlur={formField.onBlur}
                  disabled={isDisabled || field.disabled || field.readonly}
                  className={cn(
                    "h-10 w-28 shrink-0",
                    styleClassName.inputClassName,
                  )}
                />
              </Div>
            )}

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

export default DateTimeFieldWidget;
