/**
 * Search Bar Widget — unified input + submit in a single pill container.
 * Sizes: sm (sidebar), default (form row), xl (hero search).
 */

"use client";

import type { z } from "zod";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "next-vibe-ui/ui/form/form";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import { Icon } from "next-vibe-ui/unified/form-fields/icon-field/icons";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ReactStaticWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
} from "../../_shared/use-widget-context";
import type { SearchBarWidgetConfig } from "./types";

const SIZE = {
  sm: {
    container: "h-9 rounded-xl px-2 gap-1",
    icon: "h-3.5 w-3.5",
    input: "text-xs px-1",
    btn: "h-6 px-2.5 text-xs rounded-lg gap-1",
    btnIcon: "h-3 w-3",
  },
  default: {
    container: "h-11 rounded-xl px-3 gap-1.5",
    icon: "h-4 w-4",
    input: "text-sm px-1",
    btn: "h-7 px-3 text-xs rounded-lg gap-1.5",
    btnIcon: "h-3.5 w-3.5",
  },
  xl: {
    container: "h-14 rounded-2xl px-4 gap-2",
    icon: "h-5 w-5",
    input: "text-base px-2",
    btn: "h-9 px-5 text-sm rounded-xl gap-2",
    btnIcon: "h-4 w-4",
  },
} as const;

/**
 * SearchBarWidget — unified pill input + submit button.
 * Single bordered container: icon | input | [submit].
 */
export function SearchBarWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
>({
  field,
}: ReactStaticWidgetProps<
  TEndpoint,
  TUsage,
  SearchBarWidgetConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"],
    TSchema,
    TUsage,
    "primitive"
  >
>): JSX.Element | null {
  const locale = useWidgetLocale();
  const { t: tField } = useWidgetContext();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const { t: globalT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  const {
    fieldName,
    placeholder: placeholderKey,
    submitText: submitTextKey,
    submitLoadingText: submitLoadingTextKey,
    submitIcon,
    size = "default",
  } = field;

  if (!form || !onSubmit || isDisabled) {
    return null;
  }

  const s = SIZE[size];

  const placeholderText = placeholderKey ? tField(placeholderKey) : undefined;

  const submitText = submitTextKey
    ? tField(submitTextKey)
    : globalT("react.widgets.endpointRenderer.submit");

  const loadingText = submitLoadingTextKey
    ? tField(submitLoadingTextKey)
    : globalT("react.widgets.endpointRenderer.submitting");

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField, fieldState }) => (
        <FormItem className="w-full">
          <Div
            className={cn(
              "flex items-center border border-border bg-muted/40",
              "focus-within:bg-background focus-within:border-ring/50",
              "focus-within:ring-1 focus-within:ring-ring/20 transition-all",
              fieldState.error &&
                "border-destructive focus-within:border-destructive",
              s.container,
            )}
          >
            <Search className={cn("text-muted-foreground shrink-0", s.icon)} />
            <FormControl>
              <Input
                name={formField.name}
                value={formField.value ?? ""}
                onChange={(e) => formField.onChange(e.target.value)}
                onBlur={formField.onBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                type={FieldDataType.TEXT}
                placeholder={placeholderText}
                disabled={isDisabled}
                className={cn(
                  "flex-1 h-full border-none bg-transparent shadow-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground/60",
                  s.input,
                )}
              />
            </FormControl>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="unset"
              className={cn(
                "shrink-0 font-medium flex items-center bg-primary hover:bg-primary/90 text-primary-foreground",
                s.btn,
              )}
            >
              {submitIcon ? (
                <Icon icon={submitIcon} className={cn("shrink-0", s.btnIcon)} />
              ) : (
                <Search className={cn("shrink-0", s.btnIcon)} />
              )}
              <Span>{isSubmitting ? loadingText : submitText}</Span>
            </Button>
          </Div>
          {fieldState.error && <FormMessage t={tField} />}
        </FormItem>
      )}
    />
  );
}

SearchBarWidget.displayName = "SearchBarWidget";

export default SearchBarWidget;
