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

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import type { JSX } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

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
  /** Form submit handler */
  onSubmit?: () => void | Promise<void>;
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
}

/**
 * Extract ALL fields from endpoint definition
 * Recursively extracts fields from nested containers, preserving full paths
 */
function extractAllFields(
  fields: unknown,
  parentPath = "",
): Array<[string, UnifiedField]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  const fieldsObj = fields as {
    type?: string;
    children?: Record<string, unknown>;
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
        children?: Record<string, unknown>;
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
  form,
  onSubmit,
  data,
  isSubmitting = false,
  submitButtonText,
  submitButtonLoadingText,
  children,
  className,
}: EndpointRendererProps<TEndpoint, TFieldValues>): JSX.Element {
  const { t } = simpleT(locale);
  // Extract ALL fields
  const fields = extractAllFields(endpoint.fields);

  // Check if there are any request fields
  const hasRequest = hasRequestFields(fields);

  // Create render context
  const context: WidgetRenderContext = {
    locale,
    isInteractive: true,
    permissions: [],
    endpointFields: endpoint.fields, // Pass original fields for nested path lookup
  };

  // Render all widgets - they decide what to show based on data
  // Skip response-only fields that have no data
  const widgetElements = fields
    .filter(([fieldName, field]) => {
      // Always show request fields (form inputs)
      if (!isResponseField(field)) {
        return true;
      }
      // For response-only fields, only show if we have data
      const fieldData = data?.[fieldName];
      return fieldData !== null && fieldData !== undefined;
    })
    .map(([fieldName, field]) => (
      <WidgetRenderer
        key={fieldName}
        widgetType={field.ui.type}
        fieldName={fieldName}
        data={data?.[fieldName] ?? null}
        field={field}
        context={context}
        form={form}
      />
    ));

  // If we have form, onSubmit, AND request fields, wrap in form with submit button
  if (form && onSubmit && hasRequest) {
    const submitText = submitButtonText
      ? t(submitButtonText)
      : t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.endpointRenderer.submit",
        );
    const loadingText = submitButtonLoadingText
      ? t(submitButtonLoadingText)
      : t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
        );

    return (
      <Form form={form} onSubmit={onSubmit} className={className}>
        <Div className="flex flex-col gap-6">
          {widgetElements}
          {children}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? loadingText : submitText}
          </Button>
        </Div>
      </Form>
    );
  }

  // Otherwise just show the fields
  return (
    <Div className={className}>
      <Div className="flex flex-col gap-4">
        {widgetElements}
        {children}
      </Div>
    </Div>
  );
}

EndpointRenderer.displayName = "EndpointRenderer";
