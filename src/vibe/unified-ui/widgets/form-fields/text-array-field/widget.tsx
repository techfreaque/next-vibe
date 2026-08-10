/**
 * Text Array Field Widget - Platform-agnostic React implementation
 * Array of text strings input with suggestions
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
import { Span } from "next-vibe/ui/components/span";
import { TagsField } from "next-vibe/ui/components/tags-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import { cn } from "../../../_shared/cn";
import type { ReactFormFieldProps } from "../../../_shared/react-types";
import type { ArrayWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "../../../_shared/use-widget-context";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "../../../hooks/i18n";
import { getTheme } from "../_shared/constants";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { TextArrayFieldWidgetConfig } from "./types";

export function TextArrayFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends (TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never),
  TSchema extends ArrayWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,

  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  TextArrayFieldWidgetConfig<TKey, TSchema, TUsage>
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

        const arrayValue = Array.isArray(formField.value)
          ? formField.value
          : [];

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
              <TagsField
                value={arrayValue}
                onChange={(value) => formField.onChange(value)}
                onBlur={formField.onBlur}
                suggestions={field.suggestions || []}
                placeholder={field.placeholder}
                maxTags={field.maxTags}
                allowCustom={field.allowCustom ?? true}
                disabled={isDisabled || field.disabled || field.readonly}
                className={styleClassName.inputClassName}
                name={formField.name}
                t={tField}
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

export default TextArrayFieldWidget;
