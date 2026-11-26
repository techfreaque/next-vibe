/**
 * Date Range Field Widget - Platform-agnostic React implementation
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import type { JSX } from "react";
import { z } from "zod";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import { cn } from "../../../_shared/cn";
import type { ReactFormFieldProps } from "../../../_shared/react-types";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
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
import { useFormFieldDescriptionStyle } from "../_shared/description-style";
import { renderPrefillDisplay } from "../_shared/prefill";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { DateRangeFieldWidgetConfig } from "./types";

const dateRangeInputSchema = z.object({
  from: z.union([z.date(), z.string()]).optional(),
  to: z.union([z.date(), z.string()]).optional(),
});

const formatDate = (date: Date | undefined): string => {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function DateRangeFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends (TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never),
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  DateRangeFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
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
        const parsedRange = dateRangeInputSchema.safeParse(formField.value);
        const range = parsedRange.success ? parsedRange.data : {};
        const min = formatDate(field.minDate) || undefined;
        const max = formatDate(field.maxDate) || undefined;
        const startLabel = widgetT("widgets.formFields.common.startDate");
        const endLabel = widgetT("widgets.formFields.common.endDate");

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, field.className)}
          >
            <Div className="flex flex-col gap-1">
              <Div className="flex flex-row items-start gap-2">
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
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          aria-label={tField(field.description)}
                          className="cursor-help inline-flex"
                          variant={"ghost"}
                        >
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <Span className="text-sm">
                          {tField(field.description)}
                        </Span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
              <Div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                <FormControl>
                  <Input
                    ref={formField.ref}
                    type="date"
                    aria-label={startLabel}
                    placeholder={startLabel}
                    value={formatDate(parseFormDate(range.from))}
                    onChange={(event) =>
                      formField.onChange({
                        ...range,
                        from: event.target.value || undefined,
                      })
                    }
                    onBlur={formField.onBlur}
                    disabled={isDisabled || field.disabled || field.readonly}
                    min={min}
                    max={max}
                    className={cn("min-w-0", styleClassName.inputClassName)}
                  />
                </FormControl>
                <Input
                  type="date"
                  aria-label={endLabel}
                  aria-invalid={fieldState.invalid}
                  placeholder={endLabel}
                  value={formatDate(parseFormDate(range.to))}
                  onChange={(event) =>
                    formField.onChange({
                      ...range,
                      to: event.target.value || undefined,
                    })
                  }
                  onBlur={formField.onBlur}
                  disabled={isDisabled || field.disabled || field.readonly}
                  min={min}
                  max={max}
                  className={cn("min-w-0", styleClassName.inputClassName)}
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

export default DateRangeFieldWidget;
