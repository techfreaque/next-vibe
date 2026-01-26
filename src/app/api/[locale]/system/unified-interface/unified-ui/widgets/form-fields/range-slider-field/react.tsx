/**
 * Range Slider Field Widget - Platform-agnostic React implementation
 * Range selection field with draggable min/max handles
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { RangeSlider } from "next-vibe-ui/ui/range-slider";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";
import type { z } from "zod";

import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import { simpleT } from "@/i18n/core/shared";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/packages/next-vibe-ui/web/ui/form/form";

import type { FieldUsageConfig } from "../../_shared/types";
import { DEFAULT_THEME } from "../_shared/constants";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { RangeSliderFieldWidgetConfig } from "./types";

export function RangeSliderFieldWidget<
  TKey extends string,
  TSchema extends z.ZodOptional<
    z.ZodObject<{
      min: z.ZodOptional<EnumWidgetSchema>;
      max: z.ZodOptional<EnumWidgetSchema>;
    }>
  >,
  TUsage extends FieldUsageConfig,
>({
  field,
  form,
  fieldName,
  context,
}: ReactWidgetProps<
  RangeSliderFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const { t } = context;

  if (!form || !fieldName) {
    return (
      <Div>
        {t(
          "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
        )}
      </Div>
    );
  }

  const { t: globalT } = simpleT(context.locale);
  const theme = field.theme || DEFAULT_THEME;
  const isRequired = !field.schema.isOptional();

  return (
    <FormField
      control={form.control}
      name={fieldName as never}
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
                (opt) => opt.value === formField.value.min,
              )
            : field.minDefault !== undefined
              ? field.options.findIndex((opt) => opt.value === field.minDefault)
              : 0;

        const maxIndex =
          formField.value?.max !== undefined
            ? field.options.findIndex(
                (opt) => opt.value === formField.value.max,
              )
            : field.maxDefault !== undefined
              ? field.options.findIndex((opt) => opt.value === field.maxDefault)
              : field.options.length - 1;

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, field.className)}
          >
            <Div className="flex flex-row items-start gap-2">
              <FormLabel
                className={cn(
                  styleClassName.labelClassName,
                  "flex items-center gap-1.5",
                )}
              >
                <Span>{field.label && t(field.label)}</Span>
                {field.label && style === "asterisk" && isRequired && (
                  <Span className="text-blue-600 dark:text-blue-400 font-bold">
                    *
                  </Span>
                )}
                {field.description && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          className="cursor-help inline-flex"
                        >
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <Span className="text-sm">{t(field.description)}</Span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </FormLabel>
              {style === "badge" && isRequired && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {globalT("packages.nextVibeUi.web.common.required")}
                </Badge>
              )}
            </Div>

            <FormControl>
              <RangeSlider<TKey>
                options={field.options}
                minIndex={minIndex}
                maxIndex={maxIndex}
                onChange={(newMinIndex, newMaxIndex) => {
                  formField.onChange({
                    min: field.options[newMinIndex].value,
                    max: field.options[newMaxIndex].value,
                  });
                }}
                disabled={field.disabled || field.readonly}
                minLabel={field.minLabel ? t(field.minLabel) : undefined}
                maxLabel={field.maxLabel ? t(field.maxLabel) : undefined}
                t={t}
              />
            </FormControl>

            {fieldState.error && (
              <Div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage />
              </Div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export default RangeSliderFieldWidget;
