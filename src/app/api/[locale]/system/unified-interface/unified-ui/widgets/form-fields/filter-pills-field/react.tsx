/**
 * Filter Pills Field Widget - Platform-agnostic React implementation
 * Single-select field displayed as pill buttons with optional icons
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { EnumWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactFormFieldProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
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
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { getTheme } from "../_shared/constants";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { FilterPillsFieldWidgetConfig } from "./types";

export function FilterPillsFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends EnumWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  FilterPillsFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const isDisabled = useWidgetDisabled();

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
                          variant="ghost"
                          size="icon"
                          className="cursor-help inline-flex h-auto w-auto p-0"
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
              <Div className="flex flex-wrap items-center gap-2">
                {field.options.map(
                  (option: {
                    label: TKey;
                    value: string | number;
                    icon?: IconKey;
                    description?: TKey;
                  }) => {
                    const isSelected = formField.value === option.value;

                    return (
                      <Button
                        key={`${option.value}`}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          if (
                            !isDisabled &&
                            !field.disabled &&
                            !field.readonly
                          ) {
                            formField.onChange(option.value);
                          }
                        }}
                        disabled={
                          isDisabled || field.disabled || field.readonly
                        }
                        size="sm"
                        className={cn(
                          "flex items-center gap-1.5 h-9 px-3 transition-all",
                          !isSelected &&
                            "hover:border-primary/50 hover:bg-primary/5",
                        )}
                      >
                        {option.icon && (
                          <Icon
                            icon={option.icon}
                            className={cn(
                              "h-4 w-4",
                              isSelected && "text-primary-foreground",
                            )}
                          />
                        )}
                        <Span className="text-xs font-medium">
                          {t(option.label)}
                        </Span>
                      </Button>
                    );
                  },
                )}
              </Div>
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

export default FilterPillsFieldWidget;
