"use client";

/**
 * Markdown Textarea Field Widget - React implementation
 * WYSIWYG rich text editor (Tiptap) with Edit / Preview toggle.
 */

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
import { Markdown } from "next-vibe-ui/ui/markdown";
import { MarkdownEditor } from "next-vibe-ui/ui/markdown-editor";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { ReactFormFieldProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";

import type { ToolbarAction } from "next-vibe-ui/ui/markdown-editor";

import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
} from "../../_shared/use-widget-context";
import { getTheme } from "../_shared/constants";
import { getFieldStyleClassName } from "../_shared/styling";
import { getFieldValidationState } from "../_shared/validation";
import type { MarkdownTextareaFieldWidgetConfig } from "./types";

const TOOLBAR_LABEL_KEYS = {
  bold: "widgets.formFields.markdownTextarea.toolbar.bold",
  italic: "widgets.formFields.markdownTextarea.toolbar.italic",
  strike: "widgets.formFields.markdownTextarea.toolbar.strike",
  link: "widgets.formFields.markdownTextarea.toolbar.link",
  linkPrompt: "widgets.formFields.markdownTextarea.toolbar.linkPrompt",
  heading1: "widgets.formFields.markdownTextarea.toolbar.heading1",
  heading2: "widgets.formFields.markdownTextarea.toolbar.heading2",
  heading3: "widgets.formFields.markdownTextarea.toolbar.heading3",
  bulletList: "widgets.formFields.markdownTextarea.toolbar.bulletList",
  orderedList: "widgets.formFields.markdownTextarea.toolbar.orderedList",
  blockquote: "widgets.formFields.markdownTextarea.toolbar.blockquote",
  code: "widgets.formFields.markdownTextarea.toolbar.code",
  horizontalRule: "widgets.formFields.markdownTextarea.toolbar.horizontalRule",
} as const;

export function MarkdownTextareaFieldWidget<
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
  MarkdownTextareaFieldWidgetConfig<TKey, TSchema, TUsage>
>): JSX.Element {
  const { t: tField } = useWidgetContext();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const isDisabled = useWidgetDisabled();
  const [showPreview, setShowPreview] = useState(false);

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

  // Build toolbar labels from i18n
  const toolbarLabels = useMemo(() => {
    const labels: Partial<Record<ToolbarAction | "linkPrompt", string>> = {};
    for (const key of Object.keys(
      TOOLBAR_LABEL_KEYS,
    ) as (keyof typeof TOOLBAR_LABEL_KEYS)[]) {
      labels[key] = widgetT(TOOLBAR_LABEL_KEYS[key]);
    }
    return labels;
  }, [widgetT]);

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
        const rawValue: string =
          typeof formField.value === "string" ? formField.value : "";

        return (
          <FormItem
            className={cn(styleClassName.containerClassName, field.className)}
          >
            {/* ── Label row ── */}
            <Div className="flex items-center justify-between gap-2">
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
                            variant="ghost"
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

              {/* Edit / Preview toggle */}
              <Div className="flex items-center rounded-md border bg-muted/40 p-0.5 text-xs shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(): void => setShowPreview(false)}
                  className={cn(
                    "h-6 px-2.5 text-xs rounded-sm transition-all",
                    !showPreview
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {widgetT("widgets.formFields.markdownTextarea.edit")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(): void => setShowPreview(true)}
                  className={cn(
                    "h-6 px-2.5 text-xs rounded-sm transition-all",
                    showPreview
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {widgetT("widgets.formFields.markdownTextarea.preview")}
                </Button>
              </Div>
            </Div>

            {field.description && descriptionStyle === "inline" && (
              <Div className={styleClassName.inlineDescriptionClassName}>
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <Span>{tField(field.description)}</Span>
              </Div>
            )}

            <FormControl>
              {showPreview ? (
                <Div className="min-h-24 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  {rawValue ? (
                    <Markdown content={rawValue} />
                  ) : (
                    <Span className="text-muted-foreground italic">
                      {field.placeholder ? tField(field.placeholder) : ""}
                    </Span>
                  )}
                </Div>
              ) : (
                <MarkdownEditor
                  value={rawValue}
                  onChange={(md): void => formField.onChange(md)}
                  placeholder={
                    field.placeholder ? tField(field.placeholder) : undefined
                  }
                  minRows={field.rows ?? 5}
                  maxLength={field.maxLength}
                  disabled={isDisabled || field.disabled || field.readonly}
                  toolbar={field.toolbar}
                  toolbarLabels={toolbarLabels}
                  className={styleClassName.inputClassName}
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

export default MarkdownTextareaFieldWidget;
