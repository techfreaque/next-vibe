/**
 * EndpointsPage Component
 * Wrapper component that handles endpoint logic, rendering, and UI layout
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";

import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  EndpointRenderer,
  type SubmitButtonConfig,
} from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Props for EndpointsPage component
 */
export interface EndpointsPageProps<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> {
  /** Endpoint definitions (supports GET, POST, PUT, PATCH, DELETE) */
  endpoint: T;
  /** Locale for translations */
  locale: CountryLanguage;
  /** Optional description to show above the endpoint (usually not needed - comes from endpoint.description) */
  description?: string;
  /** Options for useEndpoint hook */
  endpointOptions?: UseEndpointOptions<T>;
  /** Submit button configuration (backward compatibility - prefer using endpoint definition) */
  submitButton?: SubmitButtonConfig;
  /** Enable debug logging (if not provided, reads from endpoint.debug) */
  debug?: boolean;
  /** Custom className for outer wrapper */
  className?: string;
}

/**
 * EndpointsPage Component
 *
 * A complete page wrapper that handles:
 * - Endpoint hook logic (useEndpoint)
 * - Card layout with header and content
 * - Title with optional counts
 * - Submit button in header (if configured)
 * - EndpointRenderer for form and response display
 *
 * @example
 * ```tsx
 * <EndpointsPage
 *   endpoint={leadsListEndpoints}
 *   locale={locale}
 *   icon={List}
 *   titleKey="app.api.leads.list.get.title"
 *   endpointOptions={{
 *     queryOptions: { enabled: true },
 *     filterOptions: { initialFilters: { ... } }
 *   }}
 *   submitButton={{
 *     text: "app.admin.common.actions.filter",
 *     position: "header",
 *     icon: RefreshCw,
 *     variant: "ghost",
 *     size: "sm",
 *   }}
 *   showCounts
 *   getCount={(data) => data?.response?.leads?.length}
 * />
 * ```
 */
export function EndpointsPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>({
  endpoint,
  locale,
  description,
  endpointOptions = {},
  submitButton,
  debug,
  className,
}: EndpointsPageProps<T>): React.JSX.Element {
  // Determine which endpoint to use
  const isGetEndpoint = !!endpoint.GET;
  const isMutationEndpoint =
    !!(endpoint.POST ?? endpoint.PUT ?? endpoint.PATCH) && !endpoint.GET;
  const isDeleteEndpoint =
    !!endpoint.DELETE &&
    !endpoint.GET &&
    !endpoint.POST &&
    !endpoint.PUT &&
    !endpoint.PATCH;

  // Get the active endpoint definition
  const activeEndpoint =
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Read configuration from endpoint definition with fallbacks
  const finalDebug = debug ?? activeEndpoint?.debug ?? false;
  const logger = createEndpointLogger(finalDebug, Date.now(), locale);

  // Use the endpoint hook
  const endpointState = useEndpoint(endpoint, endpointOptions, logger);

  // Extract response and data based on endpoint type
  let response;
  let responseData: Record<string, WidgetData> | undefined;
  let isLoading = false;

  if (isGetEndpoint && endpointState.read) {
    const read = endpointState.read;
    response = read.response;
    responseData =
      read.response?.success === true
        ? (read.response.data as Record<string, WidgetData>)
        : undefined;
    isLoading = read.isLoading;
  } else if (isMutationEndpoint && endpointState.create) {
    const create = endpointState.create;
    response = create.response;
    responseData =
      create.response?.success === true
        ? (create.response.data as Record<string, WidgetData>)
        : undefined;
    isLoading = create.isSubmitting;
  } else if (isDeleteEndpoint && endpointState.delete) {
    const deleteOp = endpointState.delete;
    response = deleteOp.response;
    responseData =
      deleteOp.response?.success === true
        ? (deleteOp.response.data as Record<string, WidgetData>)
        : undefined;
    isLoading = deleteOp.isSubmitting;
  }

  return (
    <Div className={className}>
      {description && (
        <Div className="mb-6">
          <P className="text-gray-600 dark:text-gray-400">{description}</P>
        </Div>
      )}

      {activeEndpoint && (
        <>
          {isGetEndpoint && endpointState.read && (
            <EndpointRenderer
              endpoint={activeEndpoint}
              form={endpointState.read.form}
              onSubmit={(): void => {
                void endpointState.read?.submitForm();
              }}
              locale={locale}
              isSubmitting={isLoading}
              data={responseData}
              submitButton={submitButton}
              response={response}
            />
          )}
          {isMutationEndpoint && endpointState.create && (
            <EndpointRenderer
              endpoint={activeEndpoint}
              form={endpointState.create.form}
              onSubmit={(): void => {
                void endpointState.create?.onSubmit();
              }}
              locale={locale}
              isSubmitting={isLoading}
              data={responseData}
              submitButton={submitButton}
              response={response}
            />
          )}
          {isDeleteEndpoint && endpointState.delete && (
            <EndpointRenderer
              endpoint={activeEndpoint}
              onSubmit={undefined}
              locale={locale}
              isSubmitting={isLoading}
              data={responseData}
              submitButton={submitButton}
              response={response}
            />
          )}
        </>
      )}
    </Div>
  );
}

EndpointsPage.displayName = "EndpointsPage";
