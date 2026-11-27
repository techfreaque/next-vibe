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
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Form } from "next-vibe/ui/components/form/form";
import type { JSX, ReactElement } from "react";
import { useCallback, useContext, useMemo, useRef } from "react";
import type {
  DefaultValues,
  FieldError,
  Path,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { get, useForm } from "react-hook-form";

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { EndpointErrorTypes, WidgetType } from "../../../core/definition/enums";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { TranslatedKeyType } from "../../../core/i18n/core/scoped-translation";
import {
  type ContentBlock,
  ErrorResponseTypes,
  type ResponseType,
} from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { Platform } from "../../../platforms/platforms";
import {
  AdminRecordContext,
  canRetryRecordRead,
} from "../../_shared/admin-record-context";
import {
  AdminRecordDetail,
  type AdminRecordSkeleton,
} from "../../_shared/admin-record-detail";
import {
  extractAllFields,
  scanForInlineButtons,
  withValueNonStrict,
} from "../../_shared/field-helpers";
import type {
  EndpointFormValues,
  ReactWidgetContext,
} from "../../_shared/react-types";
import { isResponseField } from "../../_shared/type-guards";
import { WidgetContextProvider } from "../../_shared/WidgetContextProvider";
import { createFormErrorMap } from "../../hooks/form-error-map";
import { scopedTranslation as hooksTranslation } from "../../hooks/i18n";
import { flattenFormErrors } from "../../hooks/serialize-form-errors";
import {
  useNavigationStack,
  type UseNavigationStackReturn,
} from "../../hooks/use-navigation-stack";
import { INVALID_HIDDEN_FIELD_ERROR } from "../../widgets/interactive/form-alert/root-error";
import { AdminSilentRead } from "./AdminSilentRead";
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
  widget?: ReactElement;
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
  platform: Platform;
  /** When true, only renders response fields (used by CLI result formatter) */
  responseOnly?: boolean;
  /** Navigation override — replaces the default NavigationStack navigation in widget context */
  navigationOverride?: Partial<UseNavigationStackReturn>;
}

const STUCK_SUBMIT_THRESHOLD = 3;

/** Skeleton that matches what the endpoint will render once loaded. */
function getLoadingSkeleton(
  endpoint: CreateApiEndpointAny,
): AdminRecordSkeleton {
  const hasList = extractAllFields(endpoint.fields).some(
    ([, field]) =>
      "schemaType" in field &&
      (field.schemaType === "array" || field.schemaType === "array-optional") &&
      "usage" in field &&
      field.usage.response === true,
  );
  return hasList ? "table" : "record";
}

/**
 * Human recovery copy for a failed admin read: never raw "Forbidden",
 * "Not Found" or server error text as the headline.
 */
function describeReadError({
  endpoint,
  locale,
  status,
  errorKey,
  message,
  accessDeniedLabel,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
  status: number;
  errorKey: string;
  message: string;
  accessDeniedLabel: string;
}): { title: string; message?: string; retry: boolean } {
  const { t: widgetT } = hooksTranslation.scopedT(locale);
  const endpointT = endpoint.scopedTranslation.scopedT(locale).t;
  if (status === 401 || status === 403) {
    return {
      title: accessDeniedLabel,
      message: endpointT(
        endpoint.errorTypes[EndpointErrorTypes.FORBIDDEN].description,
      ),
      retry: false,
    };
  }
  if (status === 404) {
    return {
      title: message,
      message: widgetT("widgets.recordState.notFoundMessage"),
      retry: false,
    };
  }
  if (canRetryRecordRead(status)) {
    const title = endpointT(endpoint.titleShort ?? endpoint.title);
    return {
      title: widgetT("widgets.recordState.loadFailed", { title }),
      // Client-side failures (timeout, offline) carry a human message;
      // server-side ones may carry internal wording, so use ours.
      message:
        errorKey === ErrorResponseTypes.HTTP_ERROR.errorKey
          ? message
          : widgetT("widgets.recordState.serverError"),
      retry: true,
    };
  }
  return { title: message, retry: false };
}

/**
 * Endpoint Renderer Component
 * Renders ALL fields - widgets decide what to show based on data
 */

export function EndpointRenderer<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  widget,
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
  const admin = useContext(AdminRecordContext);
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

  // CUSTOM_WIDGET with render: render directly without WidgetRenderer.
  // CONTAINER with render: also use custom rendering (e.g. browser tools).
  // This avoids loading all widget dependencies when a custom component
  // handles its own rendering (e.g. chat messages widget).
  const isCustomWidget =
    isRootContainer &&
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
  const CustomRender = useMemo((): typeof lazyRender => {
    // Select the implementation once per configured renderer. A cold lazy
    // resolving after its first render must not remount its live form.
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
    return resolved ?? lazyRender;
  }, [lazyRender]);

  // Create internal form if none provided (for display-only mode like tool calls)
  const internalFormConfig: UseFormProps<EndpointFormValues<TEndpoint>> =
    useMemo(
      () => ({
        // formSchema validates request-data ∪ url-path-params — the same merged
        // set EndpointFormValues holds — and is a concrete z.ZodObject zodResolver
        // accepts (endpoint.requestSchema alone omits url-path-param fields).
        resolver: zodResolver(endpoint.formSchema, {
          error: createFormErrorMap(locale),
        }),
        defaultValues: (data ?? {}) as DefaultValues<
          EndpointFormValues<TEndpoint>
        >,
      }),
      [endpoint.formSchema, data, locale],
    );
  const internalForm =
    useForm<EndpointFormValues<TEndpoint>>(internalFormConfig);

  // Use external form if provided, otherwise use internal form
  const form = externalForm ?? internalForm;
  const blockedSubmitState = useRef({
    endpointKey: "",
    signature: "",
    count: 0,
  });

  // Wrap onSubmit for widgets - widgets trigger submission without data parameter
  const handleWidgetSubmit = useCallback((): void => {
    if (onSubmit) {
      const focused = globalThis.document?.activeElement;
      const activationControl =
        focused &&
        (focused.localName === "button" || focused.localName === "input") &&
        "type" in focused &&
        typeof focused.type === "string"
          ? `${focused.localName}:${focused.type}`
          : (focused?.localName ?? null);
      void form.handleSubmit(
        (values) => {
          blockedSubmitState.current = {
            endpointKey: "",
            signature: "",
            count: 0,
          };
          return onSubmit(values);
        },
        (errors) => {
          // Report the failing fields and rules without collecting form values.
          const endpointKey = `${endpoint.path.join("/")}/${endpoint.method}`;
          const errorEntries = flattenFormErrors(errors);
          const fields = errorEntries.map(({ field, type, message }) => ({
            rule: `${field}: ${type}`,
            message,
          }));
          const signature = fields
            .map(({ rule }) => rule)
            .toSorted()
            .join("; ");
          const previous = blockedSubmitState.current;
          const blocked =
            previous.endpointKey === endpointKey &&
            previous.signature === signature
              ? previous.count + 1
              : 1;
          blockedSubmitState.current = {
            endpointKey,
            signature,
            count: blocked,
          };
          const firstInvalidField = errorEntries[0]?.field;
          const fieldError = firstInvalidField
            ? get<typeof errors, FieldError | undefined>(
                errors,
                firstInvalidField,
              )
            : undefined;
          const fieldRef = fieldError?.ref;
          const context = {
            endpoint: endpointKey,
            alias: endpoint.aliases?.[0] ?? null,
            firstInvalidField: firstInvalidField ?? null,
            firstInvalidFieldHasFocusTarget:
              typeof fieldRef === "object" &&
              fieldRef !== null &&
              "focus" in fieldRef &&
              typeof fieldRef.focus === "function",
            fieldRules: signature.slice(0, 400),
            consecutiveBlockedSubmits: blocked,
            // The form refused the submit: endpoint + failing rules are the
            // class; the translated messages (one per locale) and the control
            // that triggered it are per occurrence and stay out of the
            // fingerprint (2026-11-27: 40 rows for a handful of rules).
            refusalDetail: {
              activationControl,
              fields: fields
                .map(({ rule, message }) => `${rule} - ${message}`)
                .join("; ")
                .slice(0, 1000),
            },
          };
          logger.warn(
            blocked < STUCK_SUBMIT_THRESHOLD
              ? "Form validation blocked submit"
              : "Form validation blocked submit repeatedly",
            context,
          );
          // Never block silently: bring the first visible invalid field into
          // view, or explain the problem when the invalid field is not shown.
          // Runs after React painted the field errors (aria-invalid).
          const revealInvalidField = (): void => {
            const doc = globalThis.document;
            const escaped = firstInvalidField
              ? (globalThis.CSS?.escape(firstInvalidField) ?? firstInvalidField)
              : undefined;
            const namedField = escaped
              ? doc?.querySelector<HTMLElement>(
                  `[name="${escaped}"]:not([aria-hidden="true"])`,
                )
              : null;
            const target = namedField?.getClientRects().length
              ? namedField
              : doc?.querySelector<HTMLElement>('[aria-invalid="true"]');
            if (target && target.getClientRects().length > 0) {
              target.scrollIntoView({ block: "center" });
              target.focus({ preventScroll: true });
              return;
            }
            if (!firstInvalidField) {
              return;
            }
            const rootName = firstInvalidField.split(".")[0];
            const invalidField = extractAllFields(endpoint.fields).find(
              ([name]) => name === rootName,
            )?.[1];
            // The alert widgets translate this at display time; the message
            // carries only the localized field label.
            form.setError("root", {
              type: INVALID_HIDDEN_FIELD_ERROR,
              message:
                invalidField &&
                "label" in invalidField &&
                typeof invalidField.label === "string"
                  ? endpoint.scopedTranslation
                      .scopedT(locale)
                      .t(invalidField.label)
                  : "",
            });
          };
          globalThis.setTimeout(revealInvalidField, 50);
        },
      )();
    }
  }, [form, onSubmit, logger, endpoint, locale]);

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

  if (
    admin &&
    endpoint.method === "GET" &&
    !disabled &&
    !responseOnly &&
    "usage" in endpoint.fields &&
    endpoint.fields.usage.request === "urlPathParams"
  ) {
    const title = endpoint.scopedTranslation
      .scopedT(locale)
      .t(endpoint.titleShort ?? endpoint.title);
    const browse = (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={admin.browse}
      >
        {admin.browseLabel}
      </Button>
    );
    if (response?.success === false) {
      const failure = describeReadError({
        endpoint,
        locale,
        status: response.errorType.errorCode,
        errorKey: response.errorType.errorKey,
        message: response.message,
        accessDeniedLabel: admin.accessDeniedLabel,
      });
      const retry = failure.retry ? endpointMutations?.read : undefined;
      const back = admin.recordBack(endpoint) ?? {
        label: admin.browseLabel,
        onClick: admin.browse,
      };
      return (
        <AdminRecordDetail
          title={title}
          locale={locale}
          state={{
            kind: "error",
            title: failure.title,
            message: failure.message,
            action: retry
              ? {
                  label: admin.retryLabel,
                  onClick: () => void retry.refetch(),
                }
              : back,
            secondaryAction: retry ? back : undefined,
          }}
        />
      );
    }
    if (!data) {
      const params = extractAllFields(endpoint.fields).filter(([name]) =>
        endpoint.path.includes(`[${name}]`),
      );
      const values = form.watch();
      const missing = params.some(([name]) => !get(values, name));
      if (missing) {
        const editable = params.filter(
          ([, field]) => !("hidden" in field && field.hidden),
        );
        return (
          <WidgetContextProvider context={context}>
            <Form
              form={form}
              onSubmit={handleWidgetSubmitOrUndefined}
              noFormElement={_noFormElement}
              className={className}
            >
              <AdminRecordDetail
                title={title}
                breadcrumb={browse}
                subtitle={admin.selectLabel}
              >
                {editable.map(([name, field]) => (
                  <LazyWidgetRenderer
                    key={name}
                    fieldName={name}
                    field={withValueNonStrict(field, undefined, null)}
                  />
                ))}
                {editable.length > 0 && onSubmit && (
                  <Button type="submit" className="self-start">
                    {admin.openLabel}
                  </Button>
                )}
              </AdminRecordDetail>
            </Form>
          </WidgetContextProvider>
        );
      }
      if (endpointMutations?.read?.isLoadingFresh) {
        return (
          <AdminRecordDetail
            title={title}
            locale={locale}
            state={{
              kind: "loading",
              label: admin.loadingLabel,
              skeleton: getLoadingSkeleton(endpoint),
            }}
          />
        );
      }
    }
  }

  // ContentResponse: render mixed content blocks (text + images) directly
  // This applies to any endpoint that returns a ContentResponse (e.g. browser take-screenshot)
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "isContentResponse" in data &&
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

  const adminRead =
    admin &&
    platformProp === Platform.NEXT_PAGE &&
    !user.isPublic &&
    endpoint.method === "GET" &&
    !disabled &&
    !responseOnly &&
    endpointMutations?.read;
  let adminReadFeedback: JSX.Element | undefined;
  if (admin && adminRead) {
    const title = endpoint.scopedTranslation
      .scopedT(locale)
      .t(endpoint.titleShort ?? endpoint.title);
    const pending = !data && (adminRead.isLoadingFresh || adminRead.isFetching);
    if (pending) {
      adminReadFeedback = (
        <AdminRecordDetail
          title={title}
          locale={locale}
          state={{
            kind: "loading",
            label: admin.loadingLabel,
            skeleton: getLoadingSkeleton(endpoint),
          }}
        />
      );
    } else if (response?.success === false) {
      const failure = describeReadError({
        endpoint,
        locale,
        status: response.errorType.errorCode,
        errorKey: response.errorType.errorKey,
        message: response.message,
        accessDeniedLabel: admin.accessDeniedLabel,
      });
      const back = admin.recordBack(endpoint) ?? {
        label: admin.browseLabel,
        onClick: admin.browse,
      };
      adminReadFeedback = (
        <Div role="alert">
          <AdminRecordDetail
            title={title}
            locale={locale}
            state={{
              kind: "error",
              title: failure.title,
              message: failure.message,
              action: failure.retry
                ? {
                    label: admin.retryLabel,
                    onClick: (): void => {
                      void adminRead.refetch();
                    },
                  }
                : back,
              secondaryAction: failure.retry ? back : undefined,
            }}
          />
        </Div>
      );
    }
  }
  const withReadFeedback = (content: ReactElement): ReactElement =>
    adminRead ? (
      <AdminSilentRead fallback={adminReadFeedback}>{content}</AdminSilentRead>
    ) : (
      content
    );

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
    const rootWidget =
      widget ??
      (CustomRender ? (
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
      ));

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
            {withReadFeedback(rootWidget)}
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
          {withReadFeedback(rootWidget)}
          {children}
        </WidgetContextProvider>
      );
    }

    return (
      <WidgetContextProvider context={context}>
        <Div className={className}>
          {withReadFeedback(rootWidget)}
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
          {withReadFeedback(
            <Div className="flex flex-col gap-6">
              {allWidgets}
              {children}
            </Div>,
          )}
        </Form>
      </WidgetContextProvider>
    );
  }

  // No request fields - just response display, no form needed
  return (
    <WidgetContextProvider context={context}>
      <Div className={className}>
        {withReadFeedback(
          <Div className="flex flex-col gap-4">
            {allWidgets}
            {children}
          </Div>,
        )}
      </Div>
    </WidgetContextProvider>
  );
}

EndpointRenderer.displayName = "EndpointRenderer";
