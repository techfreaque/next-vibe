/**
 * Boolean Field Widget - Platform-agnostic React implementation
 * Handles BOOLEAN field type with checkbox or switch variant
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { BooleanWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactFormFieldProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/packages/next-vibe-ui/web/ui/form/form";

import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import { getTheme } from "../_shared/constants";
import type { BooleanFieldWidgetConfig } from "./types";

export function BooleanFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends BooleanWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactFormFieldProps<
  TEndpoint,
  TUsage,
  BooleanFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const t = useWidgetTranslation();
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

  const variant = field.variant || "checkbox";
  const theme = getTheme(field.theme);
  const descriptionStyle = theme.descriptionStyle;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField, fieldState }) => {
        return (
          <FormItem className={cn("space-y-2", field.className)}>
            <Div className="flex flex-col gap-1">
              {variant === "checkbox" ? (
                <Div className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      id={formField.name}
                      name={formField.name}
                      checked={formField.value}
                      onCheckedChange={(checked) => formField.onChange(checked)}
                      disabled={field.disabled || field.readonly}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </FormControl>
                  <Label
                    htmlFor={formField.name}
                    className="text-sm font-normal cursor-pointer leading-relaxed flex items-center gap-1.5"
                  >
                    <Span>
                      {field.checkboxLabel
                        ? t(field.checkboxLabel)
                        : field.label
                          ? t(field.label)
                          : null}
                    </Span>
                    {field.description && descriptionStyle === "tooltip" && (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              className="cursor-help inline-flex p-0 h-auto"
                              variant={"ghost"}
                            >
                              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
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
                    {field.description && descriptionStyle === "inline" && (
                      <Div className="flex items-center gap-1">
                        <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <Span className="text-xs text-muted-foreground opacity-75">
                          {t(field.description)}
                        </Span>
                      </Div>
                    )}
                  </Label>
                </Div>
              ) : (
                <Div className="flex items-center space-x-3 py-2">
                  <FormControl>
                    <Switch
                      id={formField.name}
                      name={formField.name}
                      checked={formField.value}
                      onCheckedChange={(checked) => formField.onChange(checked)}
                      disabled={field.disabled || field.readonly}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
                  {field.switchLabel && (
                    <Label
                      htmlFor={formField.name}
                      className="text-sm font-normal cursor-pointer leading-relaxed flex items-center gap-1.5"
                    >
                      <Span>{t(field.switchLabel)}</Span>
                      {field.description && descriptionStyle === "tooltip" && (
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                className="cursor-help inline-flex p-0 h-auto"
                                variant={"ghost"}
                              >
                                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
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
                      {field.description && descriptionStyle === "inline" && (
                        <Div className="flex items-center gap-1">
                          <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <Span className="text-xs text-muted-foreground opacity-75">
                            {t(field.description)}
                          </Span>
                        </Div>
                      )}
                    </Label>
                  )}
                </Div>
              )}
            </Div>

            {fieldState.error && (
              <Div className="flex items-center gap-2 text-sm text-destructive">
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

export default BooleanFieldWidget;
