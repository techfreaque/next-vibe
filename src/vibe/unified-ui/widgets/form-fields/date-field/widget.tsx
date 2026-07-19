/**
 * Date Field Widget - Platform-agnostic React implementation
 */

"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { DatePicker } from "next-vibe/ui/ui/date-picker";
import { Div } from "next-vibe/ui/ui/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/ui/form/form";
import { AlertCircle } from "next-vibe/ui/ui/icons/AlertCircle";
import { Info } from "next-vibe/ui/ui/icons/Info";
import { Span } from "next-vibe/ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/ui/tooltip";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { ReactFormFieldProps } from "next-vibe/unified-ui/_shared/react-types";
import type { DateWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "next-vibe/unified-ui/hooks/i18n";
import { getTheme } from "next-vibe/unified-ui/widgets/form-fields/_shared/constants";
import { renderPrefillDisplay } from "next-vibe/unified-ui/widgets/form-fields/_shared/prefill";
import { getFieldStyleClassName } from "next-vibe/unified-ui/widgets/form-fields/_shared/styling";
import { getFieldValidationState } from "next-vibe/unified-ui/widgets/form-fields/_shared/validation";
import type { JSX } from "react";

import type { DateFieldWidgetConfig } from "./types";

export function DateFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TSchema extends DateWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  DateFieldWidgetConfig<TKey, TSchema, TUsage>
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
                  {field.description && descriptionStyle === "tooltip" && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
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
                </FormLabel>
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
              ) : (
                <DatePicker
                  value={formField.value as Date | undefined}
                  onChange={(date) => formField.onChange(date)}
                  onBlur={formField.onBlur}
                  placeholder={
                    field.placeholder ? tField(field.placeholder) : undefined
                  }
                  minDate={field.minDate}
                  maxDate={field.maxDate}
                  disabled={isDisabled || field.disabled || field.readonly}
                  className={styleClassName.inputClassName}
                  name={formField.name}
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

export default DateFieldWidget;
