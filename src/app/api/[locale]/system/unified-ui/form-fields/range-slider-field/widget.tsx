/**
 * Range Slider Field Widget - Platform-agnostic React implementation
 * Range selection field with draggable min/max handles
 */

"use client";

import { AlertCircle } from "lucide-react";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { cn } from "next-vibe/core/utils/utils";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "next-vibe/platforms/react/i18n";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/web/ui/form/form";
import { Info } from "next-vibe/ui/web/ui/icons/Info";
import { RangeSlider } from "next-vibe/ui/web/ui/range-slider";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/web/ui/tooltip";
import type { ReactFormFieldProps } from "next-vibe/unified-ui/_shared/react-types";
import type { EnumWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { getTheme } from "next-vibe/unified-ui/form-fields/_shared/constants";
import { getFieldStyleClassName } from "next-vibe/unified-ui/form-fields/_shared/styling";
import { getFieldValidationState } from "next-vibe/unified-ui/form-fields/_shared/validation";
import type { JSX } from "react";
import type { z } from "zod";

import type { RangeSliderFieldWidgetConfig } from "./types";

export function RangeSliderFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TSchema extends z.ZodOptional<
    z.ZodObject<{
      min: z.ZodOptional<EnumWidgetSchema>;
      max: z.ZodOptional<EnumWidgetSchema>;
    }>
  >,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  RangeSliderFieldWidgetConfig<TKey, TSchema, TUsage>
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

        // Calculate current indices from field values
        const minIndex =
          formField.value?.min !== undefined
            ? field.options.findIndex(
                (opt: {
                  label: string;
                  value: string | number;
                  icon?: string;
                  description?: string;
                }) => opt.value === formField.value.min,
              )
            : field.minDefault !== undefined
              ? field.options.findIndex(
                  (opt: {
                    label: string;
                    value: string | number;
                    icon?: string;
                    description?: string;
                  }) => opt.value === field.minDefault,
                )
              : 0;

        const maxIndex =
          formField.value?.max !== undefined
            ? field.options.findIndex(
                (opt: {
                  label: string;
                  value: string | number;
                  icon?: string;
                  description?: string;
                }) => opt.value === formField.value.max,
              )
            : field.maxDefault !== undefined
              ? field.options.findIndex(
                  (opt: {
                    label: string;
                    value: string | number;
                    icon?: string;
                    description?: string;
                  }) => opt.value === field.maxDefault,
                )
              : field.options.length - 1;

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
              <RangeSlider
                options={field.options.map((opt) => ({
                  ...opt,
                  label: tField(opt.label),
                  description: opt.description
                    ? tField(opt.description)
                    : undefined,
                }))}
                minIndex={minIndex}
                maxIndex={maxIndex}
                onChange={(newMinIndex, newMaxIndex) => {
                  formField.onChange({
                    min: field.options[newMinIndex].value,
                    max: field.options[newMaxIndex].value,
                  });
                }}
                disabled={isDisabled || field.disabled || field.readonly}
                minLabel={
                  field.minLabel
                    ? tField(field.minLabel)
                    : widgetT("widgets.rangeSlider.min")
                }
                maxLabel={
                  field.maxLabel
                    ? tField(field.maxLabel)
                    : widgetT("widgets.rangeSlider.max")
                }
              />
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

export default RangeSliderFieldWidget;
