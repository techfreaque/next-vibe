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
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { WidgetType } from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type {
  ContentBlock,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  useNavigationStack,
  type UseNavigationStackReturn,
} from "next-vibe/platforms/react/hooks/use-navigation-stack";
import { Div } from "next-vibe/ui/ui/div";
import { Form } from "next-vibe/ui/ui/form/form";
import {
  extractAllFields,
  scanForInlineButtons,
  withValueNonStrict,
} from "next-vibe/unified-ui/_shared/field-helpers";
import type {
  EndpointFormValues,
  ReactWidgetContext,
} from "next-vibe/unified-ui/_shared/react-types";
import { isResponseField } from "next-vibe/unified-ui/_shared/type-guards";
import { WidgetContextProvider } from "next-vibe/unified-ui/_shared/WidgetContextProvider";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";
import type {
  DefaultValues,
  Path,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import { ContentBlocksRenderer } from "./ContentBlocksRenderer";
import { LazyWidgetRenderer } from "./LazyWidgetRenderer";

/**
 * Submit button configuration
 */
export interface SubmitButtonConfig<TKey extends string> {
  /** Submit button text translation key */
  text?: TKey;
  /** Submit button loading text translation key */
  loadingText?: TKey;
  /** Submit button position - 'bottom' (default) or 'header' */
  position?: "bottom" | "header";
  /** Icon component to display in the button */
  icon?: React.ComponentType<{ className?: string }>;
  /** Button variant */
  variant?: "default" | "secondary" | "destructive" | "ghost" | "link";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
}

export interface CancelButtonConfig<TKey extends string> {
  /** Cancel button text translation key */
  text?: TKey;
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
interface EndpointRendererProps<TEndpoint extends CreateApiEndpointAny> {
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
  submitButtonText?: TranslatedKeyType;
  /** Submit button loading text translation key (deprecated - use submitButton.loadingText) */
  submitButtonLoadingText?: TranslatedKeyType;
  /** Submit button configuration */
  submitButton?: SubmitButtonConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
  >;
  /** Cancel button configuration */
  cancelButton?: CancelButtonConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
  >;
  /** Additional content to render below fields */
  children?: React.ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Disable all form inputs */
  disabled?: boolean;
  /** Full ResponseType<T> from endpoint (includes success/error state) */
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined;
  /** Endpoint mutations for widgets to trigger directly */
  endpointMutations?: ReactWidgetContext<TEndpoint>["endpointMutations"];
  /** Logger instance for widgets to use directly */
  logger: EndpointLogger;
  /** User object for permission checks */
  user: JwtPayloadType;
  /** When true, renders FormProvider without a <form> element.
   *  Use this to embed endpoint fields inside an existing form (avoids nested <form>). */
  _noFormElement?: boolean;
  /** Platform identifier - defaults to NEXT_PAGE */
  platform?: Platform;
  /** When true, only renders response fields (used by CLI result formatter) */
  responseOnly?: boolean;
  /** Navigation override — replaces the default NavigationStack navigation in widget context */
  navigationOverride?: Partial<UseNavigationStackReturn>;
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
  _noFormElement: noFormElementProp = false,
  platform: platformProp,
  responseOnly = false,
  navigationOverride,
}: EndpointRendererProps<TEndpoint>): JSX.Element {
  // Initialize navigation stack for cross-definition navigation
  const baseNavigation = useNavigationStack();
  // Extract stable refs to avoid creating new object on every render
  const basePush = baseNavigation.push;
  const baseReplace = baseNavigation.replace;
  const basePop = baseNavigation.pop;
  const baseStack = baseNavigation.stack;
  const baseCanGoBack = baseNavigation.canGoBack;
  const baseCurrent = baseNavigation.current;
  const baseIsPushPending = baseNavigation.isPushPending;
  const navigation = useMemo(
    () =>
      navigationOverride
        ? {
            push: navigationOverride.push ?? basePush,
            replace: navigationOverride.replace ?? baseReplace,
            pop: navigationOverride.pop ?? basePop,
            stack: navigationOverride.stack ?? baseStack,
            canGoBack: navigationOverride.canGoBack ?? baseCanGoBack,
            current: navigationOverride.current ?? baseCurrent,
            isPushPending:
              navigationOverride.isPushPending ?? baseIsPushPending,
          }
        : {
            push: basePush,
            replace: baseReplace,
            pop: basePop,
            stack: baseStack,
            canGoBack: baseCanGoBack,
            current: baseCurrent,
            isPushPending: baseIsPushPending,
          },
    [
      navigationOverride,
      basePush,
      baseReplace,
      basePop,
      baseStack,
      baseCanGoBack,
      baseCurrent,
      baseIsPushPending,
    ],
  );

  // Check if the root fields config requests noFormElement (e.g. customWidgetObject)
  const _noFormElement =
    noFormElementProp ||
    ("noFormElement" in endpoint.fields &&
      endpoint.fields.noFormElement === true);

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
        // formSchema validates request-data ∪ url-path-params — the same merged
        // set EndpointFormValues holds — and is a concrete z.ZodObject zodResolver
        // accepts (endpoint.requestSchema alone omits url-path-param fields).
        resolver: zodResolver(endpoint.formSchema),
        defaultValues: (data ?? {}) as DefaultValues<
          EndpointFormValues<TEndpoint>
        >,
      }),
      [endpoint.formSchema, data],
    );
  const internalForm =
    useForm<EndpointFormValues<TEndpoint>>(internalFormConfig);

  // Use external form if provided, otherwise use internal form
  const form = externalForm ?? internalForm;

  // Wrap onSubmit for widgets - widgets trigger submission without data parameter
  const handleWidgetSubmit = useCallback((): void => {
    if (onSubmit) {
      void form.handleSubmit(onSubmit)();
    }
  }, [form, onSubmit]);

  const handleWidgetSubmitOrUndefined = onSubmit
    ? handleWidgetSubmit
    : undefined;

  // Scan endpoint fields for inline buttons/alerts (memoized)
  // This determines if the root container should auto-add buttons
  const inlineButtonInfo = useMemo(
    () => scanForInlineButtons(endpoint.fields),
    [endpoint.fields],
  );

  // Create render context with scoped translation from endpoint definition
  // Memoized so Zustand selectors only fire when actual values change
  const context = useMemo<ReactWidgetContext<TEndpoint>>(
    () => ({
      locale,
      isInteractive: platformProp !== Platform.MCP,
      logger,
      user,
      platform: platformProp ?? Platform.NEXT_PAGE,
      responseOnly,
      endpointFields: endpoint.fields,
      disabled,
      response,
      endpointMutations,
      t: endpoint.scopedTranslation.scopedT(locale).t,
      navigation,
      endpoint,
      form,
      onSubmit: handleWidgetSubmitOrUndefined,
      onCancel,
      isSubmitting,
      submitButton,
      cancelButton,
    }),
    [
      locale,
      logger,
      user,
      disabled,
      response,
      endpointMutations,
      endpoint,
      form,
      handleWidgetSubmitOrUndefined,
      onCancel,
      isSubmitting,
      submitButton,
      cancelButton,
      navigation,
      platformProp,
      responseOnly,
    ],
  );

  // ContentResponse: render mixed content blocks (text + images) directly
  // This applies to any endpoint that returns a ContentResponse (e.g. browser take-screenshot)
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "__isContentResponse" in data &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    return (
      <ContentBlocksRenderer
        blocks={data.content as ContentBlock[]}
        platform={platformProp}
      />
    );
  }

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
    // CUSTOM_WIDGET with render: render directly without WidgetRenderer.
    // CONTAINER with render: also use custom rendering (e.g. browser tools).
    // This avoids loading all widget dependencies when a custom component
    // handles its own rendering (e.g. chat messages widget).
    const isCustomWidget =
      "type" in endpoint.fields &&
      (endpoint.fields.type === WidgetType.CUSTOM_WIDGET ||
        endpoint.fields.type === WidgetType.CONTAINER);
    const lazyRender = isCustomWidget
      ? (
          endpoint.fields as typeof endpoint.fields & {
            // oxlint-disable-next-line typescript/no-explicit-any
            render?: React.ComponentType<any>;
          }
        ).render
      : undefined;
    // If the lazy has been pre-warmed, use the resolved component directly
    // so the fast sync reconciler doesn't have to handle React.lazy/Suspense internals.
    // lazyWidget() sets .resolved after preload(); bare React.lazy uses _payload._status === 1.
    const resolved: React.ComponentType | undefined =
      lazyRender &&
      typeof lazyRender === "function" &&
      "cliWidget" in lazyRender &&
      "resolved" in lazyRender &&
      lazyRender.resolved !== null &&
      lazyRender.resolved !== undefined
        ? (lazyRender.resolved as React.ComponentType)
        : lazyRender &&
            typeof lazyRender === "object" &&
            "_payload" in lazyRender &&
            (
              lazyRender as {
                _payload: {
                  _status: number;
                  _result: { default: React.ComponentType };
                };
              }
            )._payload._status === 1
          ? (
              lazyRender as {
                _payload: {
                  _status: number;
                  _result: { default: React.ComponentType };
                };
              }
            )._payload._result.default
          : undefined;
    // oxlint-disable-next-line typescript/no-explicit-any
    const CustomRender: React.ComponentType<any> | undefined =
      resolved ?? lazyRender;

    const rootWidget = CustomRender ? (
      <CustomRender
        fieldName={"" as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValueNonStrict(endpoint.fields, data, null)}
        inlineButtonInfo={inlineButtonInfo}
      />
    ) : (
      <LazyWidgetRenderer
        fieldName={"" as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValueNonStrict(endpoint.fields, data, null)}
        inlineButtonInfo={inlineButtonInfo}
      />
    );

    // Always wrap in Form if we have form fields (request fields)
    if (hasRequest) {
      return (
        <WidgetContextProvider context={context}>
          <Form
            form={form}
            onSubmit={handleWidgetSubmitOrUndefined}
            className={className}
            noFormElement={_noFormElement}
          >
            {rootWidget}
            {children}
          </Form>
        </WidgetContextProvider>
      );
    }

    // No request fields - just response display, no form needed
    // Custom widgets: no wrapper Div, render directly
    if (CustomRender) {
      return (
        <WidgetContextProvider context={context}>
          {rootWidget}
          {children}
        </WidgetContextProvider>
      );
    }

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
      <LazyWidgetRenderer
        key={fieldName}
        fieldName={fieldName as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValueNonStrict(field, fieldValue, data)}
      />
    );
  });

  // Always wrap in Form if we have form fields (request fields)
  if (hasRequest) {
    return (
      <WidgetContextProvider context={context}>
        <Form
          form={form}
          onSubmit={handleWidgetSubmitOrUndefined}
          className={className}
          noFormElement={_noFormElement}
        >
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
