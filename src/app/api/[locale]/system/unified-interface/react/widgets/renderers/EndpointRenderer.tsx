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
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import type { JSX } from "react";
import { useEffect } from "react";
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny } from "../../../shared/types/endpoint";
import type { UnifiedField } from "../../../shared/types/endpoint";
import { WidgetType } from "../../../shared/types/enums";
import type {
  WidgetData,
  WidgetRenderContext,
} from "../../../shared/widgets/types";
import { isResponseField } from "../../../shared/widgets/utils/field-helpers";
import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Submit button configuration
 */
export interface SubmitButtonConfig {
  /** Submit button text translation key */
  text?: TranslationKey;
  /** Submit button loading text translation key */
  loadingText?: TranslationKey;
  /** Submit button position - 'bottom' (default) or 'header' */
  position?: "bottom" | "header";
  /** Icon component to display in the button */
  icon?: React.ComponentType<{ className?: string }>;
  /** Button variant */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
}

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
  /** Submit button text translation key (deprecated - use submitButton.text) */
  submitButtonText?: TranslationKey;
  /** Submit button loading text translation key (deprecated - use submitButton.loadingText) */
  submitButtonLoadingText?: TranslationKey;
  /** Submit button configuration */
  submitButton?: SubmitButtonConfig;
  /** Additional content to render below fields */
  children?: React.ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Disable all form inputs */
  disabled?: boolean;
  /** Full ResponseType<T> from endpoint (includes success/error state) */
  response?: ResponseType<WidgetData>;
  /** Endpoint mutations for widgets to trigger directly */
  endpointMutations?: WidgetRenderContext["endpointMutations"];
}

/**
 * Extract ALL fields from endpoint definition
 * Recursively extracts fields from nested containers, preserving full paths
 * Handles object, object-optional, and object-union types
 */
function extractAllFields<const TKey extends string>(
  fields: UnifiedField<TKey>,
  parentPath = "",
): Array<[string, UnifiedField<TKey>]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  const fieldsObj = fields as {
    type?: string;
    children?: Record<string, UnifiedField<TKey>>;
    discriminator?: string;
    variants?: readonly UnifiedField<TKey>[];
  };

  // Handle object-union fields
  if (fieldsObj.type === "object-union") {
    // For unions, add the union field itself (widgets will handle variant switching)
    const fullPath = parentPath ? `${parentPath}` : "";
    return fullPath ? [[fullPath, fields]] : [];
  }

  // Check if this is an object field with children
  if (
    (fieldsObj.type !== "object" && fieldsObj.type !== "object-optional") ||
    !fieldsObj.children
  ) {
    return [];
  }

  const result: Array<[string, UnifiedField<TKey>]> = [];

  for (const [fieldName, fieldDef] of Object.entries(fieldsObj.children)) {
    if (typeof fieldDef === "object" && fieldDef !== null) {
      // Check if this is a container with nested fields
      const fieldDefObj = fieldDef as {
        type?: string;
        children?: Record<string, UnifiedField<TKey>>;
        discriminator?: string;
        variants?: readonly UnifiedField<TKey>[];
        ui?: { type?: string };
      };

      // Handle union fields
      if (fieldDefObj.type === "object-union") {
        // Add the union field itself - union widget will handle variant rendering
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef as UnifiedField<TKey>]);
      } else if (
        (fieldDefObj.type === "object" ||
          fieldDefObj.type === "object-optional") &&
        fieldDefObj.children &&
        fieldDefObj.ui?.type === "container"
      ) {
        // Add the container itself instead of flattening its children
        // ContainerWidget will handle rendering children with proper grid layout
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef as UnifiedField<TKey>]);
      } else {
        // Regular field, add it with full path
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
        result.push([fullPath, fieldDef as UnifiedField<TKey>]);
      }
    }
  }

  return result;
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
  data,
  isSubmitting = false,
  children,
  className,
  disabled = false,
  response,
  endpointMutations,
}: EndpointRendererProps<TEndpoint, TFieldValues>): JSX.Element {
  // Check if endpoint.fields itself is a container widget
  const isRootContainer =
    endpoint.fields.type === "object" &&
    endpoint.fields.ui?.type === WidgetType.CONTAINER;

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
    response, // Pass full ResponseType<T> to widgets (includes error state)
    scopedT: endpoint.scopedTranslation.scopedT, // Pass scoped translation function for module-specific translations
    endpointMutations, // Pass endpoint mutations for widgets to call directly
  };

  // Check if there are any request fields
  const hasRequest =
    endpoint.fields.usage && "request" in endpoint.fields.usage;

  /**
   * NEW APPROACH: If the root field is a container widget, render it directly.
   * The ContainerWidget will handle rendering all children with proper layout,
   * title, description, getCount, and submitButton.
   *
   * This ensures the root container's configuration (like submitButton) is not lost.
   */
  if (isRootContainer) {
    // Wrap onSubmit for form handling - this will be passed to Form component
    const handleFormSubmit = onSubmit
      ? (): void => {
          void form.handleSubmit(onSubmit)();
        }
      : undefined;

    // Wrap onSubmit for widgets - widgets trigger submission without data parameter
    const handleWidgetSubmit = onSubmit
      ? (): void => {
          void form.handleSubmit(onSubmit)();
        }
      : undefined;

    const rootWidget = (
      <WidgetRenderer
        widgetType={WidgetType.CONTAINER}
        fieldName=""
        data={data ?? null}
        field={endpoint.fields}
        context={context}
        form={form as UseFormReturn<FieldValues>}
        onSubmit={handleWidgetSubmit}
        isSubmitting={isSubmitting}
        endpoint={endpoint}
      />
    );

    // Always wrap in Form if we have form fields (request fields)
    if (hasRequest) {
      return (
        <Form form={form} onSubmit={handleFormSubmit} className={className}>
          {rootWidget}
          {children}
        </Form>
      );
    }

    // No request fields - just response display, no form needed
    return (
      <Div className={className}>
        {rootWidget}
        {children}
      </Div>
    );
  }

  /**
   * FALLBACK: If root is not a container, extract and render children separately.
   * This is for backward compatibility with non-container root fields.
   */
  const allFields = extractAllFields(endpoint.fields);

  // Sort fields by order (lower numbers first, undefined/null last)
  const fields = allFields.toSorted(([, fieldA], [, fieldB]) => {
    const orderA = fieldA.ui?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = fieldB.ui?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  // Filter fields: only show response fields with data, keep all request fields
  const visibleFields = fields.filter(([fieldName, field]) => {
    if (isResponseField(field)) {
      // Only show response fields with data
      const fieldData = data?.[fieldName];
      return fieldData !== null && fieldData !== undefined;
    }
    // Always show request fields
    return true;
  });

  // Wrap onSubmit for widgets - widgets trigger submission without data parameter
  const handleWidgetSubmit = onSubmit
    ? (): void => {
        void form.handleSubmit(onSubmit)();
      }
    : undefined;

  // Render all widgets in sorted order (respecting order property across request/response)
  const allWidgets = visibleFields.map(([fieldName, field]) => (
    <WidgetRenderer
      key={fieldName}
      widgetType={field.ui.type}
      fieldName={fieldName}
      data={data?.[fieldName] ?? null}
      field={field}
      context={context}
      form={form as UseFormReturn<FieldValues>}
      onSubmit={handleWidgetSubmit}
      isSubmitting={isSubmitting}
      endpoint={endpoint}
    />
  ));

  // Always wrap in Form if we have form fields (request fields)
  if (hasRequest) {
    // Wrap onSubmit for form handling - this will be passed to Form component
    const handleFormSubmit = onSubmit
      ? (): void => {
          void form.handleSubmit(onSubmit)();
        }
      : undefined;

    return (
      <Form form={form} onSubmit={handleFormSubmit} className={className}>
        <Div className="flex flex-col gap-6">
          {allWidgets}
          {children}
        </Div>
      </Form>
    );
  }

  // No request fields - just response display, no form needed
  return (
    <Div className={className}>
      <Div className="flex flex-col gap-4">
        {allWidgets}
        {children}
      </Div>
    </Div>
  );
}

EndpointRenderer.displayName = "EndpointRenderer";
