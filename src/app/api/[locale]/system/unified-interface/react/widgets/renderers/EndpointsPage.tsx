/**
 * EndpointsPage Component
 * Wrapper component that handles endpoint logic, rendering, and UI layout
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils/utils";
import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { useNavigationStack } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
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
  /** Internal: Disable navigation stack rendering (used for stacked instances) */
  _disableNavigationStack?: boolean;
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
  _disableNavigationStack = false,
}: EndpointsPageProps<T>): React.JSX.Element {
  // Check navigation stack to render stacked endpoints (only for base layer)
  const navigation = useNavigationStack();

  // Determine which endpoint to use for base layer
  const isGetEndpoint = !!endpoint.GET;
  const isMutationEndpoint = !!(endpoint.POST ?? endpoint.PUT ?? endpoint.PATCH) && !endpoint.GET;
  const isDeleteEndpoint =
    !!endpoint.DELETE && !endpoint.GET && !endpoint.POST && !endpoint.PUT && !endpoint.PATCH;

  // Get the active endpoint definition for rendering response data
  // Priority: GET (for response rendering) > POST/PUT/PATCH (for form) > DELETE
  const activeEndpoint =
    endpoint.GET ?? endpoint.POST ?? endpoint.PUT ?? endpoint.PATCH ?? endpoint.DELETE;

  // Read configuration from endpoint definition with fallbacks
  const finalDebug = debug ?? activeEndpoint?.debug ?? false;
  const logger = useMemo(
    () => createEndpointLogger(finalDebug, Date.now(), locale),
    [finalDebug, locale],
  );

  // Use the endpoint hook for base endpoint
  const endpointState = useEndpoint(endpoint, endpointOptions, logger);

  // Extract response and data based on endpoint type
  let response;
  let responseData: WidgetData | undefined;
  let isLoading = false;

  if (isGetEndpoint && endpointState.read) {
    const read = endpointState.read;
    response = read.response;
    responseData = read.response?.success === true ? read.response.data : undefined;
    isLoading = read.isLoading;
  } else if (isMutationEndpoint && endpointState.create) {
    const create = endpointState.create;
    response = create.response;
    responseData = create.response?.success === true ? create.response.data : undefined;
    isLoading = create.isSubmitting;
  } else if (isDeleteEndpoint && endpointState.delete) {
    const deleteOp = endpointState.delete;
    response = deleteOp.response;
    responseData = deleteOp.response?.success === true ? deleteOp.response.data : undefined;
    isLoading = deleteOp.isSubmitting;
  }

  // Build endpoint mutations for context - widgets can call these directly
  const endpointMutations = {
    create: endpointState.create
      ? {
          submit: async (): Promise<void> => {
            await endpointState.create?.onSubmit();
          },
          isSubmitting: endpointState.create.isSubmitting,
        }
      : undefined,
    update: endpointState.update
      ? {
          submit: async (data: Record<string, WidgetData>): Promise<void> => {
            await endpointState.update?.submit(data);
            if (endpointState.read) {
              await endpointState.read.refetch();
            }
          },
          isSubmitting: endpointState.update.isSubmitting,
        }
      : undefined,
    delete: endpointState.delete
      ? {
          submit: async (): Promise<void> => {
            await endpointState.delete?.submit();
            if (endpointState.read) {
              await endpointState.read.refetch();
            }
          },
          isSubmitting: endpointState.delete.isSubmitting,
        }
      : undefined,
    read: endpointState.read
      ? {
          refetch: async (): Promise<void> => {
            await endpointState.read?.refetch();
          },
          isLoading: endpointState.read.isLoading,
        }
      : undefined,
  };

  // Base layer is visible when stack is empty (only applies to non-stacked instances)
  const isBaseVisible = _disableNavigationStack || navigation.stack.length === 0;

  return (
    <>
      {/* Base endpoint layer - always mounted to preserve state */}
      <Div className={cn(className, !isBaseVisible && "hidden")}>
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
                form={endpointState.create?.form ?? endpointState.read.form}
                onSubmit={
                  endpointState.create
                    ? (): void => {
                        void endpointState.create?.onSubmit();
                      }
                    : (): void => {
                        void endpointState.read?.submitForm();
                      }
                }
                locale={locale}
                isSubmitting={endpointState.create?.isSubmitting ?? isLoading}
                data={responseData}
                submitButton={submitButton}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
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
                endpointMutations={endpointMutations}
                logger={logger}
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
                endpointMutations={endpointMutations}
                logger={logger}
              />
            )}
          </>
        )}
      </Div>

      {/* Stacked endpoint layers - each mounted to preserve state */}
      {/* Only render navigation stack for base layer (not for stacked instances) */}
      {!_disableNavigationStack &&
        navigation.stack.map((entry, index) => {
          const isVisible = index === navigation.stack.length - 1;
          const method = entry.endpoint.method;

          // Render appropriate endpoint based on method with proper type safety
          if (method === "GET") {
            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  endpoint={{ GET: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    read: {
                      urlPathParams: entry.params,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  _disableNavigationStack={true}
                />
              </Div>
            );
          }

          if (method === "POST") {
            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  endpoint={{ POST: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    create: {
                      urlPathParams: entry.params,
                      autoPrefillData: entry.params,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  _disableNavigationStack={true}
                />
              </Div>
            );
          }

          if (method === "PATCH") {
            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  endpoint={{ PATCH: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    update: {
                      urlPathParams: entry.params,
                      autoPrefillData: entry.params,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  _disableNavigationStack={true}
                />
              </Div>
            );
          }

          if (method === "DELETE") {
            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  endpoint={{ DELETE: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    delete: {
                      urlPathParams: entry.params,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  _disableNavigationStack={true}
                />
              </Div>
            );
          }

          if (method === "PUT") {
            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  endpoint={{ PUT: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    create: {
                      urlPathParams: entry.params,
                      autoPrefillData: entry.params,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  _disableNavigationStack={true}
                />
              </Div>
            );
          }

          return null;
        })}
    </>
  );
}

EndpointsPage.displayName = "EndpointsPage";
