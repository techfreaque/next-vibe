/**
 * Boolean Field Widget - Platform-agnostic React implementation
 * Handles BOOLEAN field type with checkbox or switch variant
 */

"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { BooleanWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/packages/next-vibe-ui/web/ui/form/form";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BooleanFieldWidgetConfig } from "./types";

export function BooleanFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends BooleanWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  BooleanFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const { t } = context;

  if (!context.form || !fieldName) {
    return (
      <Div>
        {t(
          "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
        )}
      </Div>
    );
  }

  const variant = field.variant || "checkbox";

  return (
    <FormField
      control={context.form.control}
      name={fieldName}
      render={({ field: formField, fieldState }) => {
        return (
          <FormItem className={cn("space-y-2", field.className)}>
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
                  className="text-sm font-normal cursor-pointer leading-relaxed"
                >
                  {field.checkboxLabel
                    ? t(field.checkboxLabel)
                    : field.label
                      ? t(field.label)
                      : null}
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
                    className="text-sm font-normal cursor-pointer leading-relaxed"
                  >
                    {t(field.switchLabel)}
                  </Label>
                )}
              </Div>
            )}

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
