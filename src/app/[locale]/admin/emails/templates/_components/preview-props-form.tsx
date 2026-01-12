/**
 * Preview Props Form Component
 * Dynamic form that renders inputs based on template previewFields configuration
 */

"use client";

import { RefreshCw, Settings2 } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { P } from "next-vibe-ui/ui/typography";
import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { PreviewFieldConfig } from "@/app/api/[locale]/emails/registry/types";
import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

interface PreviewPropsFormProps {
  previewFields?: Record<string, PreviewFieldConfig>;
  defaultProps: Record<string, string | number | boolean>;
  onPropsChange: (props: Record<string, string | number | boolean>) => void;
}

export function PreviewPropsForm({
  previewFields,
  defaultProps,
  onPropsChange,
}: PreviewPropsFormProps): ReactElement | null {
  const { t } = useTranslation();
  const [props, setProps] = useState<Record<string, string | number | boolean>>(
    defaultProps,
  );

  // Update local state when default props change
  useEffect(() => {
    setProps(defaultProps);
  }, [defaultProps]);

  const handleFieldChange = useCallback(
    (fieldName: string, value: string | number | boolean): void => {
      const newProps = { ...props, [fieldName]: value };
      setProps(newProps);
      onPropsChange(newProps);
    },
    [props, onPropsChange],
  );

  const handleReset = useCallback(() => {
    setProps(defaultProps);
    onPropsChange(defaultProps);
  }, [defaultProps, onPropsChange]);

  const renderField = useCallback(
    (fieldName: string, config: PreviewFieldConfig) => {
      const fieldValue = props[fieldName];
      const fieldId = `preview-field-${fieldName}`;

      const labelText = t(config.label as TranslationKey);
      const descriptionText = config.description
        ? t(config.description as TranslationKey)
        : undefined;

      switch (config.type) {
        case "text":
        case "email":
        case "url":
          return (
            <Div key={fieldName} className="flex flex-col gap-2">
              <Label htmlFor={fieldId} className="font-medium">
                {labelText}
                {config.required && (
                  <Span className="text-red-500 ml-1">*</Span>
                )}
              </Label>
              {descriptionText && (
                <P className="text-xs text-gray-500 dark:text-gray-400">
                  {descriptionText}
                </P>
              )}
              <Input
                id={fieldId}
                type={config.type}
                value={(fieldValue as string) || ""}
                onChange={(e) => {
                  handleFieldChange(fieldName, e.target.value);
                }}
                required={config.required}
                className="text-sm"
              />
            </Div>
          );

        case "textarea":
          return (
            <Div key={fieldName} className="flex flex-col gap-2">
              <Label htmlFor={fieldId} className="font-medium">
                {labelText}
                {config.required && (
                  <Span className="text-red-500 ml-1">*</Span>
                )}
              </Label>
              {descriptionText && (
                <P className="text-xs text-gray-500 dark:text-gray-400">
                  {descriptionText}
                </P>
              )}
              <Textarea
                id={fieldId}
                value={(fieldValue as string) || ""}
                onChange={(e) => {
                  handleFieldChange(fieldName, e.target.value);
                }}
                required={config.required}
                rows={config.rows || 3}
                className="text-sm"
              />
            </Div>
          );

        case "number":
          return (
            <Div key={fieldName} className="flex flex-col gap-2">
              <Label htmlFor={fieldId} className="font-medium">
                {labelText}
                {config.required && (
                  <Span className="text-red-500 ml-1">*</Span>
                )}
              </Label>
              {descriptionText && (
                <P className="text-xs text-gray-500 dark:text-gray-400">
                  {descriptionText}
                </P>
              )}
              <Input
                id={fieldId}
                type="number"
                value={typeof fieldValue === "number" ? fieldValue : 0}
                onChange={(e) => {
                  handleFieldChange(fieldName, e.target.value);
                }}
                required={config.required}
                min={config.min}
                max={config.max}
                className="text-sm"
              />
            </Div>
          );

        case "boolean":
          return (
            <Div
              key={fieldName}
              className="flex flex-row items-start gap-3 py-2"
            >
              <Checkbox
                id={fieldId}
                checked={(fieldValue as boolean) || false}
                onCheckedChange={(checked) => {
                  handleFieldChange(fieldName, checked);
                }}
                className="mt-1"
              />
              <Div className="flex flex-col gap-1">
                <Label htmlFor={fieldId} className="font-medium cursor-pointer">
                  {labelText}
                </Label>
                {descriptionText && (
                  <P className="text-xs text-gray-500 dark:text-gray-400">
                    {descriptionText}
                  </P>
                )}
              </Div>
            </Div>
          );

        case "date":
          return (
            <Div key={fieldName} className="flex flex-col gap-2">
              <Label htmlFor={fieldId} className="font-medium">
                {labelText}
                {config.required && (
                  <Span className="text-red-500 ml-1">*</Span>
                )}
              </Label>
              {descriptionText && (
                <P className="text-xs text-gray-500 dark:text-gray-400">
                  {descriptionText}
                </P>
              )}
              <Input
                id={fieldId}
                type="date"
                value={(fieldValue as string) || ""}
                onChange={(e) => {
                  handleFieldChange(fieldName, e.target.value);
                }}
                required={config.required}
                className="text-sm"
              />
            </Div>
          );

        case "select":
          return (
            <Div key={fieldName} className="flex flex-col gap-2">
              <Label htmlFor={fieldId} className="font-medium">
                {labelText}
                {config.required && (
                  <Span className="text-red-500 ml-1">*</Span>
                )}
              </Label>
              {descriptionText && (
                <P className="text-xs text-gray-500 dark:text-gray-400">
                  {descriptionText}
                </P>
              )}
              <Select
                value={(fieldValue as string) || ""}
                onValueChange={(value) => {
                  handleFieldChange(fieldName, value);
                }}
                required={config.required}
              >
                <SelectTrigger id={fieldId}>
                  <SelectValue
                    placeholder={t(
                      "app.admin.emails.templates.preview.form.select_option" as TranslationKey,
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {config.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label as TranslationKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
          );

        default:
          return null;
      }
    },
    [props, handleFieldChange, t],
  );

  const hasPreviewFields = useMemo(
    () => previewFields && Object.keys(previewFields).length > 0,
    [previewFields],
  );

  if (!hasPreviewFields) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <CardTitle>
              {t("app.admin.emails.templates.preview.form.title")}
            </CardTitle>
          </Div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            type="button"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("app.admin.emails.templates.preview.form.reset")}
          </Button>
        </Div>
        <P className="text-sm text-gray-600 dark:text-gray-400">
          {t("app.admin.emails.templates.preview.form.description")}
        </P>
      </CardHeader>
      <CardContent>
        <Div className="flex flex-col gap-4">
          {previewFields &&
            Object.entries(previewFields).map(([fieldName, config]) =>
              renderField(fieldName, config),
            )}
        </Div>
      </CardContent>
    </Card>
  );
}
