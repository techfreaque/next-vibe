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
import { useMemo } from "react";
import type { DefaultValues, Path, UseFormReturn } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodTypeAny } from "zod";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { useNavigationStack } from "../../../react/hooks/use-navigation-stack";
import type { EndpointLogger } from "../../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import { Platform } from "../../../shared/types/platform";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import {
  extractAllFields,
  scanForInlineButtons,
  withValueNonStrict,
} from "../../widgets/_shared/field-helpers";
import type {
  EndpointFormValues,
  ReactWidgetContext,
} from "../../widgets/_shared/react-types";
import { isResponseField } from "../../widgets/_shared/type-guards";
import { WidgetContextProvider } from "../../widgets/_shared/WidgetContextProvider";
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
  variant?: "default" | "secondary" | "destructive" | "ghost" | "link";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
}

export interface CancelButtonConfig {
  /** Cancel button text translation key */
  text?: TranslationKey;
  /** Button variant */
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link"
    | "outline";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Endpoint Renderer Props
 */
export interface EndpointRendererProps<TEndpoint extends CreateApiEndpointAny> {
  /** The endpoint definition */
  endpoint: TEndpoint;
  /** Current locale */
  locale: CountryLanguage;
  /** React Hook Form instance */
  form?: UseFormReturn<EndpointFormValues<TEndpoint>>;
  /** Form submit handler - receives form data */
  onSubmit?: (data: EndpointFormValues<TEndpoint>) => void | Promise<void>;
  /** Cancel handler - when provided, shows Cancel button alongside Submit */
  onCancel?: () => void;
  /** Data to populate fields with (can be object for multiple fields or any WidgetData for single field) */
  data?: WidgetData;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Submit button text translation key (deprecated - use submitButton.text) */
  submitButtonText?: TranslationKey;
  /** Submit button loading text translation key (deprecated - use submitButton.loadingText) */
  submitButtonLoadingText?: TranslationKey;
  /** Submit button configuration */
  submitButton?: SubmitButtonConfig;
  /** Cancel button configuration */
  cancelButton?: CancelButtonConfig;
  /** Additional content to render below fields */
  children?: React.ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Disable all form inputs */
  disabled?: boolean;
  /** Full ResponseType<T> from endpoint (includes success/error state) */
  response?: ResponseType<WidgetData>;
  /** Endpoint mutations for widgets to trigger directly */
  endpointMutations?: ReactWidgetContext<TEndpoint>["endpointMutations"];
  /** Logger instance for widgets to use directly */
  logger: EndpointLogger;
  /** User object for permission checks */
  user: JwtPayloadType;
}

/**
 * Endpoint Renderer Component
 * Renders ALL fields - widgets decide what to show based on data
 */
export function EndpointRenderer<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  locale,
  form: externalForm,
  onSubmit,
  onCancel,
  data,
  isSubmitting = false,
  children,
  className,
  disabled = false,
  response,
  endpointMutations,
  submitButton,
  cancelButton,
  logger,
  user,
}: EndpointRendererProps<TEndpoint>): JSX.Element {
  // Initialize navigation stack for cross-definition navigation
  const navigation = useNavigationStack();

  // Check if endpoint.fields itself is a container or array widget (render directly)
  const isRootContainer =
    "schemaType" in endpoint.fields &&
    (endpoint.fields.schemaType === "object" ||
      endpoint.fields.schemaType === "object-optional" ||
      endpoint.fields.schemaType === "array" ||
      endpoint.fields.schemaType === "array-optional" ||
      endpoint.fields.schemaType === "widget-object");

  // Create internal form if none provided (for display-only mode like tool calls)
  const internalFormConfig: UseFormProps<EndpointFormValues<TEndpoint>> =
    useMemo(
      () => ({
        resolver: zodResolver<
          EndpointFormValues<TEndpoint>,
          ZodTypeAny,
          EndpointFormValues<TEndpoint>
        >(endpoint.requestSchema),
        defaultValues: (data ?? {}) as DefaultValues<
          EndpointFormValues<TEndpoint>
        >,
      }),
      [endpoint.requestSchema, data],
    );
  const internalForm =
    useForm<EndpointFormValues<TEndpoint>>(internalFormConfig);

  // Use external form if provided, otherwise use internal form
  const form = externalForm ?? internalForm;

  // Wrap onSubmit for widgets - widgets trigger submission without data parameter
  const handleWidgetSubmit = onSubmit
    ? (): void => {
        void form.handleSubmit(onSubmit)();
      }
    : undefined;

  // Scan endpoint fields for inline buttons/alerts (memoized)
  // This determines if the root container should auto-add buttons
  const inlineButtonInfo = useMemo(
    () => scanForInlineButtons(endpoint.fields),
    [endpoint.fields],
  );

  // Create render context with scoped translation from endpoint definition
  const context: ReactWidgetContext<TEndpoint> = {
    locale,
    isInteractive: true,
    logger,
    user,
    platform: Platform.NEXT_PAGE,
    endpointFields: endpoint.fields,
    disabled,
    response,
    endpointMutations,
    t: endpoint.scopedTranslation.scopedT(locale).t,
    navigation,
    endpoint,
    form,
    onSubmit: handleWidgetSubmit,
    onCancel,
    isSubmitting,
    submitButton,
    cancelButton,
    buttonState: {
      hasRenderedSubmitButton: false,
      hasRenderedBackButton: false,
    },
  };

  // Check if there are any request fields
  const hasRequest =
    "usage" in endpoint.fields && endpoint.fields.usage.request;

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

    const rootWidget = (
      <WidgetRenderer
        fieldName={"" as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValueNonStrict(endpoint.fields, data, null) as never}
        inlineButtonInfo={inlineButtonInfo}
      />
    );

    // Always wrap in Form if we have form fields (request fields)
    if (hasRequest) {
      return (
        <WidgetContextProvider context={context}>
          <Form form={form} onSubmit={handleFormSubmit} className={className}>
            {rootWidget}
            {children}
          </Form>
        </WidgetContextProvider>
      );
    }

    // No request fields - just response display, no form needed
    return (
      <WidgetContextProvider context={context}>
        <Div className={className}>
          {rootWidget}
          {children}
        </Div>
      </WidgetContextProvider>
    );
  }

  /**
   * FALLBACK: If root is not a container, extract and render children separately.
   * This is for backward compatibility with non-container root fields.
   */
  const allFields = extractAllFields(endpoint.fields);

  // Sort fields by order (lower numbers first, undefined/null last)
  const fields = allFields.toSorted(([, fieldA], [, fieldB]) => {
    let orderA = Number.MAX_SAFE_INTEGER;
    if ("ui" in fieldA && fieldA.ui && typeof fieldA.ui === "object") {
      const ui = fieldA.ui;
      if ("order" in ui && typeof ui.order === "number") {
        orderA = ui.order;
      }
    }

    let orderB = Number.MAX_SAFE_INTEGER;
    if ("ui" in fieldB && fieldB.ui && typeof fieldB.ui === "object") {
      const ui = fieldB.ui;
      if ("order" in ui && typeof ui.order === "number") {
        orderB = ui.order;
      }
    }
    return orderA - orderB;
  });

  // Filter fields: only show response fields with data, keep all request fields
  const visibleFields = fields.filter(([fieldName, field]) => {
    if (isResponseField(field)) {
      // Only show response fields with data
      const fieldData =
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        !(data instanceof Date)
          ? data[fieldName]
          : undefined;
      return fieldData !== null && fieldData !== undefined;
    }
    // Always show request fields
    return true;
  });

  // Render all widgets in sorted order (respecting order property across request/response)
  const allWidgets = visibleFields.map(([fieldName, field]) => {
    const fieldValue =
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      !(data instanceof Date)
        ? data[fieldName]
        : undefined;

    return (
      <WidgetRenderer
        key={fieldName}
        fieldName={fieldName as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValueNonStrict(field, fieldValue, data) as never}
      />
    );
  });

  // Always wrap in Form if we have form fields (request fields)
  if (hasRequest) {
    return (
      <WidgetContextProvider context={context}>
        <Form form={form} onSubmit={handleWidgetSubmit} className={className}>
          <Div className="flex flex-col gap-6">
            {allWidgets}
            {children}
          </Div>
        </Form>
      </WidgetContextProvider>
    );
  }

  // No request fields - just response display, no form needed
  return (
    <WidgetContextProvider context={context}>
      <Div className={className}>
        <Div className="flex flex-col gap-4">
          {allWidgets}
          {children}
        </Div>
      </Div>
    </WidgetContextProvider>
  );
}

EndpointRenderer.displayName = "EndpointRenderer";
