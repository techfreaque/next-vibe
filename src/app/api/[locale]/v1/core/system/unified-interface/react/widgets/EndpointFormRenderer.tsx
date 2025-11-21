"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import type { JSX } from "react";
import type { FieldPath, UseFormReturn } from "react-hook-form";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import { type CreateApiEndpointAny } from "../../shared/types/endpoint";

/**
 * Extract all request field paths from endpoint definition
 * Recursively walks the field structure to find all data fields
 * Returns field info including path and widget type
 */
function extractRequestFieldPaths(
  fields: unknown,
  parentPath = "",
): string[] {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  const fieldPaths: string[] = [];

  // Type assertion for the fields structure
  const fieldsObj = fields as Record<string, unknown>;

  // Check if this is a field with usage
  const fieldWithUsage = fieldsObj as {
    type?: string;
    usage?: { request?: string };
    children?: Record<string, unknown>;
    ui?: Record<string, unknown>;
  };

  // If this is an object field with children, recurse into children
  if (fieldWithUsage.type === "object" && fieldWithUsage.children) {
    for (const [key, childField] of Object.entries(fieldWithUsage.children)) {
      const fullPath = parentPath ? `${parentPath}.${key}` : key;
      const childPaths = extractRequestFieldPaths(childField, fullPath);
      fieldPaths.push(...childPaths);
    }
  }

  // If this is a primitive field with request usage, add its path
  if (
    fieldWithUsage.type === "primitive" &&
    fieldWithUsage.usage?.request === "data"
  ) {
    if (parentPath) {
      fieldPaths.push(parentPath);
    }
  }

  // If we're at the root level, check all keys
  if (!parentPath) {
    for (const [key, value] of Object.entries(fieldsObj)) {
      const childPaths = extractRequestFieldPaths(value, key);
      fieldPaths.push(...childPaths);
    }
  }

  return fieldPaths;
}

/**
 * Endpoint Form Renderer Props
 */
export interface EndpointFormRendererProps<
  TEndpoint extends CreateApiEndpointAny,
> {
  /** The endpoint definition */
  endpoint: TEndpoint;
  /** React Hook Form instance */
  form: UseFormReturn<TEndpoint["TRequestOutput"]>;
  /** Form submit handler */
  onSubmit: (() => void | Promise<void>) | undefined;
  /** Current locale */
  locale: CountryLanguage;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Submit button text translation key */
  submitButtonText?: TranslationKey;
  /** Additional content to render below form fields */
  children?: React.ReactNode;
  /** Custom className for the form container */
  className?: string;
}

/**
 * Endpoint Form Renderer
 *
 * Automatically renders all form fields from an endpoint definition.
 * This is a fully data-driven component that requires minimal JSX.
 *
 * Features:
 * - Automatically discovers all request fields from definition
 * - Renders fields in the order they appear in the definition
 * - No manual field configuration needed
 * - 100% type-safe
 * - Works with any endpoint
 *
 * Example:
 * ```tsx
 * <EndpointFormRenderer
 * endpoint={loginEndpoints.POST}
 * form={form}
 * onSubmit={onSubmit}
 * locale={locale}
 * isSubmitting={isSubmitting}
 * />
 * ```
 */
export function EndpointFormRenderer<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  form,
  onSubmit,
  locale,
  isSubmitting = false,
  submitButtonText,
  children,
  className,
}: EndpointFormRendererProps<TEndpoint>): JSX.Element {
  const { t } = simpleT(locale);

  // Extract all request field paths from the endpoint definition
  const fieldPaths = extractRequestFieldPaths(endpoint.fields);

  // Get submit button text
  const submitText = submitButtonText
    ? t(submitButtonText)
    : t("app.user.other.login.auth.login.signInButton");
  const loadingText = t("app.user.common.loading");

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <Div className="flex flex-col gap-6">
        {/* Automatically render all request fields */}
        {fieldPaths.map((fieldPath) => (
          <EndpointFormField
            key={fieldPath}
            name={fieldPath as FieldPath<TEndpoint["TRequestOutput"]>}
            control={form.control}
            endpointFields={endpoint.fields}
            schema={endpoint.requestSchema}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        ))}

        {/* Custom content (e.g., links, additional UI) */}
        {children}

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? loadingText : submitText}
        </Button>
      </Div>
    </Form>
  );
}

EndpointFormRenderer.displayName = "EndpointFormRenderer";
