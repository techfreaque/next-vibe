/**
 * Int Field Widget - Platform-agnostic React implementation
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { NumberWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
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
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { getTheme } from "../_shared/constants";
import { renderPrefillDisplay } from "../_shared/prefill";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { IntFieldWidgetConfig } from "./types";

export function IntFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends NumberWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  IntFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  if (!form || !fieldName) {
    return (
      <Div>
        {t(
          "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
        )}
      </Div>
    );
  }

  const { t: globalT } = simpleT(locale);
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
                    <Span className="text-blue-600 dark:text-blue-400 font-bold">
                      *
                    </Span>
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
                    className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {globalT("packages.nextVibeUi.web.common.required")}
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
              {field.prefillDisplay &&
              formField.value &&
              !fieldState.isDirty ? (
                renderPrefillDisplay(
                  formField.value,
                  field.label,
                  field.prefillDisplay,
                  t,
                )
              ) : (
                <Input
                  type="number"
                  value={formField.value}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                  }}
                  onBlur={formField.onBlur}
                  placeholder={
                    field.placeholder ? t(field.placeholder) : undefined
                  }
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  disabled={field.disabled || field.readonly}
                  className={styleClassName.inputClassName}
                  name={formField.name}
                />
              )}
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

export default IntFieldWidget;
