/**
 * Endpoint Renderer Component
 *
 * KEY CONCEPT:
 * - Renders ALL fields from the endpoint definition
 * - Widgets decide what to show based on their data state
 * - FormFieldWidget shows input fields (for request)
 * - Other widgets show response data when available
 * - NO separate request/response modes - just render everything
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { X } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny } from "../../../shared/types/endpoint";
import type { UnifiedField } from "../../../shared/types/endpoint";
import type {
  WidgetData,
  WidgetRenderContext,
} from "../../../shared/widgets/types";
import { WidgetRenderer } from "./WidgetRenderer";
import { isResponseField } from "../../../shared/widgets/utils/field-helpers";
import { simpleT } from "@/i18n/core/shared";

/**
 * Endpoint Renderer Props
 */
export interface EndpointRendererProps<
  TEndpoint extends CreateApiEndpointAny,
  TFieldValues extends FieldValues = FieldValues,
> {
  /** The endpoint definition */
  endpoint: TEndpoint;
  /** Current locale */
  locale: CountryLanguage;
  /** React Hook Form instance */
  form?: UseFormReturn<TFieldValues>;
  /** Form submit handler - receives form data */
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  /** Cancel handler - when provided, shows Cancel button alongside Submit */
  onCancel?: () => void;
  /** Data to populate fields with */
  data?: Record<string, WidgetData>;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Submit button text translation key */
  submitButtonText?: TranslationKey;
  /** Submit button loading text translation key */
  submitButtonLoadingText?: TranslationKey;
  /** Additional content to render below fields */
  children?: React.ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Disable all form inputs */
  disabled?: boolean;
}

/**
 * Extract ALL fields from endpoint definition
 * Recursively extracts fields from nested containers, preserving full paths
 */
function extractAllFields(
  fields: UnifiedField,
  parentPath = "",
): Array<[string, UnifiedField]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  const fieldsObj = fields as {
    type?: string;
    children?: Record<string, UnifiedField>;
  };

  // Check if this is an object field with children
  if (fieldsObj.type !== "object" || !fieldsObj.children) {
    return [];
  }

  const result: Array<[string, UnifiedField]> = [];

  for (const [fieldName, fieldDef] of Object.entries(fieldsObj.children)) {
    if (typeof fieldDef === "object" && fieldDef !== null) {
      // Check if this is a container with nested fields
      const fieldDefObj = fieldDef as {
        type?: string;
        children?: Record<string, UnifiedField>;
        ui?: { type?: string };
      };

      if (
        fieldDefObj.type === "object" &&
        fieldDefObj.children &&
        fieldDefObj.ui?.type === "container"
      ) {
        // Recursively extract nested fields with parent path
        const nestedPath = parentPath
          ? `${parentPath}.${fieldName}`
          : fieldName;
        const nestedFields = extractAllFields(fieldDef, nestedPath);
        result.push(...nestedFields);
      } else {
        // Regular field, add it with full path
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef as UnifiedField]);
      }
    }
  }

  return result;
}

/**
 * Check if there are any request fields in the endpoint
 */
function hasRequestFields(fields: Array<[string, UnifiedField]>): boolean {
  return fields.some(([_, field]) => {
    const usage = field.usage;
    if (!usage) {
      return false;
    }
    return "request" in usage;
  });
}

/**
 * Endpoint Renderer Component
 * Renders ALL fields - widgets decide what to show based on data
 */
export function EndpointRenderer<
  TEndpoint extends CreateApiEndpointAny,
  TFieldValues extends FieldValues = FieldValues,
>({
  endpoint,
  locale,
  form: externalForm,
  onSubmit,
  onCancel,
  data,
  isSubmitting = false,
  submitButtonText,
  submitButtonLoadingText,
  children,
  className,
  disabled = false,
}: EndpointRendererProps<TEndpoint, TFieldValues>): JSX.Element {
  const { t } = simpleT(locale);
  // Extract ALL fields
  const fields = extractAllFields(endpoint.fields);

  // Check if there are any request fields
  const hasRequest = hasRequestFields(fields);

  // Create internal form if none provided (for display-only mode like tool calls)
  const internalForm = useForm<TFieldValues>({
    resolver: zodResolver(endpoint.requestSchema),
    defaultValues: (data ?? {}) as DefaultValues<TFieldValues>,
  });

  // Reset form when data changes
  useEffect(() => {
    if (!externalForm && data) {
      internalForm.reset(data as TFieldValues);
    }
  }, [data, externalForm, internalForm]);

  // Use external form if provided, otherwise use internal form
  const form = externalForm ?? internalForm;

  // Create render context
  const context: WidgetRenderContext = {
    locale,
    isInteractive: true,
    permissions: [],
    endpointFields: endpoint.fields, // Pass original fields for nested path lookup
    disabled, // Pass disabled state to widgets
  };

  // Separate fields into request and response for better UX
  const requestFields = fields.filter(([_, field]) => !isResponseField(field));
  const responseFields = fields.filter(([fieldName, field]) => {
    if (!isResponseField(field)) {
      return false;
    }
    // Only show response fields with data
    const fieldData = data?.[fieldName];
    return fieldData !== null && fieldData !== undefined;
  });

  // Render request widgets
  const requestWidgets = requestFields.map(([fieldName, field]) => (
    <WidgetRenderer
      key={fieldName}
      widgetType={field.ui.type}
      fieldName={fieldName}
      data={data?.[fieldName] ?? null}
      field={field}
      context={context}
      form={form as UseFormReturn<FieldValues>}
    />
  ));

  // Render response widgets
  const responseWidgets = responseFields.map(([fieldName, field]) => (
    <WidgetRenderer
      key={fieldName}
      widgetType={field.ui.type}
      fieldName={fieldName}
      data={data?.[fieldName] ?? null}
      field={field}
      context={context}
      form={form as UseFormReturn<FieldValues>}
    />
  ));

  // Show visual separator only when we have both request and response data
  const showSeparator = requestFields.length > 0 && responseFields.length > 0;

  // Always wrap in Form if we have form fields (request fields)
  if (hasRequest) {
    // If we have onSubmit, show submit button
    if (onSubmit) {
      const submitText = submitButtonText
        ? t(submitButtonText)
        : t(
            "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
          );
      const loadingText = submitButtonLoadingText
        ? t(submitButtonLoadingText)
        : t(
            "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
          );

      // Wrap onSubmit with handleSubmit to pass validated form data
      const handleFormSubmit = (): void => {
        void form.handleSubmit(onSubmit)();
      };

      return (
        <Form form={form} onSubmit={handleFormSubmit} className={className}>
          <Div className="flex flex-col gap-6">
            {requestWidgets}
            {showSeparator && (
              <Div className="border-t border-border/50 my-2" />
            )}
            {responseWidgets}
            {children}
            {onCancel ? (
              <Div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? loadingText : submitText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t(
                    "app.api.system.unifiedInterface.react.widgets.toolCall.actions.cancel",
                  )}
                </Button>
              </Div>
            ) : (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? loadingText : submitText}
              </Button>
            )}
          </Div>
        </Form>
      );
    }

    // No onSubmit - display only mode (like tool calls), but still wrap in Form for context
    return (
      <Form form={form} className={className}>
        <Div className="flex flex-col gap-4">
          {requestWidgets}
          {showSeparator && <Div className="border-t border-border/50 my-2" />}
          {responseWidgets}
          {children}
        </Div>
      </Form>
    );
  }

  // No request fields - just response display, no form needed
  return (
    <Div className={className}>
      <Div className="flex flex-col gap-4">
        {responseWidgets}
        {children}
      </Div>
    </Div>
  );
}

EndpointRenderer.displayName = "EndpointRenderer";
