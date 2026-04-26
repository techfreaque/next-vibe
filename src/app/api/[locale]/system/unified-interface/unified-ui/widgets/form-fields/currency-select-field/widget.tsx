/**
 * Currency Select Field Widget - Platform-agnostic React implementation
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe-ui/ui/form/form";
import { Info } from "next-vibe-ui/ui/icons/Info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactFormFieldProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";

import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { getTheme } from "../_shared/constants";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { CurrencySelectFieldWidgetConfig } from "./types";

// Common currencies
const CURRENCIES = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "CHF", label: "Swiss Franc (CHF)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "CNY", label: "Chinese Yuan (CNY)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "BRL", label: "Brazilian Real (BRL)" },
];

export function CurrencySelectFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  CurrencySelectFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const t = useWidgetTranslation<TEndpoint>();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const isDisabled = useWidgetDisabled();

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  if (!form || !fieldName) {
    return <Div>{widgetT("react.widgets.formField.requiresContext")}</Div>;
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
                  <Span>{field.label && t(field.label)}</Span>
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
                            {t(field.description)}
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
                  <Span>{t(field.description)}</Span>
                </Div>
              )}
            </Div>

            <FormControl>
              <Select
                onValueChange={(value) => formField.onChange(value)}
                value={
                  formField.value !== undefined && formField.value !== null
                    ? formField.value
                    : undefined
                }
                disabled={isDisabled || field.disabled || field.readonly}
                name={formField.name}
              >
                <SelectTrigger
                  className={cn(styleClassName.inputClassName, "h-10")}
                >
                  <SelectValue
                    placeholder={
                      field.placeholder ? t(field.placeholder) : undefined
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            {fieldState.error && (
              <Div className={styleClassName.errorClassName}>
                <AlertCircle className="h-4 w-4" />
                <FormMessage t={t} />
              </Div>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export default CurrencySelectFieldWidget;
