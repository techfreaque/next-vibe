/**
 * EndpointsPage Component
 * Wrapper component that handles endpoint logic, rendering, and UI layout
 */

"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
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
  /** User object for permission checks */
  user: JwtPayloadType;
  /** Internal: Disable navigation stack rendering (used for stacked instances) */
  _disableNavigationStack?: boolean;
  /** Force which endpoint method to render when multiple are present (e.g., both GET and PATCH) */
  forceMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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
  user,
  _disableNavigationStack = false,
  forceMethod,
}: EndpointsPageProps<T>): React.JSX.Element {
  // Check navigation stack to render stacked endpoints (only for base layer)
  const navigation = useNavigationStack();

  // Determine which endpoint to use for base layer
  // If forceMethod is provided, use that; otherwise use default priority
  const forcedEndpoint = forceMethod ? endpoint[forceMethod] : undefined;

  const isGetEndpoint = forcedEndpoint ? forceMethod === "GET" : !!endpoint.GET;
  const isMutationEndpoint = forcedEndpoint
    ? forceMethod === "POST" || forceMethod === "PUT" || forceMethod === "PATCH"
    : !!(endpoint.POST ?? endpoint.PUT ?? endpoint.PATCH) && !endpoint.GET;
  const isDeleteEndpoint = forcedEndpoint
    ? forceMethod === "DELETE"
    : !!endpoint.DELETE &&
      !endpoint.GET &&
      !endpoint.POST &&
      !endpoint.PUT &&
      !endpoint.PATCH;

  // Get the active endpoint definition for rendering response data
  // Priority: Forced method > GET (for response rendering) > POST/PUT/PATCH (for form) > DELETE
  const activeEndpoint =
    forcedEndpoint ??
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Read configuration from endpoint definition with fallbacks
  const finalDebug = debug ?? activeEndpoint?.debug ?? false;
  const logger = useMemo(
    () => createEndpointLogger(finalDebug, Date.now(), locale),
    [finalDebug, locale],
  );

  // Build mutation options with onSuccess callback for navigation
  const mutationOptionsWithNav = useMemo(() => {
    const existingMutationOptions = endpointOptions?.create?.mutationOptions;

    // For POST endpoints, navigate to GET endpoint after successful creation if GET exists
    if (isMutationEndpoint && endpoint.GET && endpoint.POST) {
      const targetGetEndpoint = endpoint.GET;

      return {
        ...existingMutationOptions,
        onSuccess: ({
          responseData,
          requestData,
          pathParams,
        }): void | ErrorResponseType | Promise<void | ErrorResponseType> => {
          // Call existing onSuccess first
          const existingResult = existingMutationOptions?.onSuccess?.({
            responseData,
            requestData,
            pathParams,
          });

          // Navigate to GET endpoint with ID from response
          if (
            responseData &&
            typeof responseData === "object" &&
            "id" in responseData
          ) {
            const id = String(responseData.id);
            navigation.replace(targetGetEndpoint, {
              urlPathParams: { id } as never,
            });
          }

          return existingResult;
        },
      };
    }

    return existingMutationOptions;
  }, [
    isMutationEndpoint,
    endpoint.GET,
    endpointOptions?.create?.mutationOptions,
    navigation,
  ]);

  // Merge navigation-aware mutation options into endpoint options
  const finalEndpointOptions = useMemo(() => {
    if (!mutationOptionsWithNav) {
      return endpointOptions;
    }

    return {
      ...endpointOptions,
      create: {
        ...endpointOptions?.create,
        mutationOptions: mutationOptionsWithNav,
      },
    };
  }, [endpointOptions, mutationOptionsWithNav]);

  // Use the endpoint hook for base endpoint
  const endpointState = useEndpoint(endpoint, finalEndpointOptions, logger);

  // Extract response and data based on endpoint type
  let response;
  let responseData: WidgetData | undefined;
  let isLoading = false;

  if (isGetEndpoint && endpointState.read) {
    const read = endpointState.read;
    response = read.response;
    responseData =
      read.response?.success === true ? read.response.data : undefined;
    isLoading = read.isLoading;
  } else if (
    isMutationEndpoint &&
    (endpointState.create || endpointState.update)
  ) {
    const operation = endpointState.update ?? endpointState.create;
    if (operation) {
      response = operation.response;
      responseData =
        operation.response?.success === true
          ? operation.response.data
          : undefined;
      isLoading = operation.isSubmitting;
    }

    // CRITICAL: For mutations with prefillFromGet (GET + PATCH/PUT), use GET data for prefilling
    // The mutation response data is for showing success/error, not for prefilling the form
    if (endpointState.read) {
      const readResponse = endpointState.read.response;
      const readData =
        readResponse?.success === true ? readResponse.data : undefined;
      console.log("EndpointsPage PATCH/PUT with GET prefill", {
        hasRead: true,
        isLoading: endpointState.read.isLoading,
        readResponse,
        readData,
        readDataKeys: readData ? Object.keys(readData as object) : [],
        currentResponseData: responseData,
        mutationResponse: operation?.response,
      });
      if (readData) {
        responseData = readData;
      }
    } else {
      console.log("EndpointsPage PATCH/PUT without GET", {
        hasRead: false,
      });
    }
  } else if (isDeleteEndpoint && endpointState.delete) {
    const deleteOp = endpointState.delete;
    response = deleteOp.response;
    responseData =
      deleteOp.response?.success === true ? deleteOp.response.data : undefined;
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
  const isBaseVisible =
    _disableNavigationStack || navigation.stack.length === 0;

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
                user={user}
              />
            )}
            {isMutationEndpoint &&
              (endpointState.create || endpointState.update) && (
                <EndpointRenderer
                  endpoint={activeEndpoint}
                  form={
                    endpointState.update?.form ?? endpointState.create?.form
                  }
                  onSubmit={(): void => {
                    if (endpointState.update) {
                      void endpointState.update.submit(
                        endpointState.update.form.getValues(),
                      );
                    } else {
                      void endpointState.create?.onSubmit();
                    }
                  }}
                  locale={locale}
                  isSubmitting={endpointState.update?.isSubmitting ?? isLoading}
                  data={responseData}
                  submitButton={submitButton}
                  response={response}
                  endpointMutations={endpointMutations}
                  logger={logger}
                  user={user}
                />
              )}
            {isDeleteEndpoint && endpointState.delete && (
              <EndpointRenderer
                endpoint={activeEndpoint}
                form={endpointState.delete.form}
                onSubmit={(): void => {
                  void endpointState.delete?.submitForm();
                }}
                locale={locale}
                isSubmitting={isLoading}
                data={responseData}
                submitButton={submitButton}
                response={response}
                endpointMutations={endpointMutations}
                logger={logger}
                user={user}
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
                      urlPathParams: entry.params.urlPathParams,
                    },
                  }}
                  submitButton={submitButton}
                  debug={debug}
                  user={user}
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
                  user={user}
                  endpoint={{ POST: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    create: {
                      urlPathParams: entry.params.urlPathParams,
                      autoPrefillData: entry.params.data,
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
            // If prefillFromGet is true and getEndpoint exists, include GET endpoint for auto-prefill
            const endpointConfig =
              entry.prefillFromGet && entry.getEndpoint
                ? { GET: entry.getEndpoint, PATCH: entry.endpoint }
                : { PATCH: entry.endpoint };

            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  user={user}
                  endpoint={endpointConfig}
                  locale={locale}
                  forceMethod={method}
                  endpointOptions={{
                    // CRITICAL: Pass read options whenever prefillFromGet is true
                    // getEndpoint might be undefined if it was auto-detected, but we still need the urlPathParams
                    ...(entry.prefillFromGet
                      ? {
                          read: {
                            urlPathParams: entry.params.urlPathParams as never,
                          },
                        }
                      : {}),
                    update: {
                      urlPathParams: entry.params.urlPathParams,
                      autoPrefillData: entry.params.data,
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
                  user={user}
                  endpoint={{ DELETE: entry.endpoint }}
                  locale={locale}
                  endpointOptions={{
                    delete: {
                      urlPathParams: entry.params.urlPathParams,
                      autoPrefillData: entry.params.urlPathParams,
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
            // If prefillFromGet is true and getEndpoint exists, include GET endpoint for auto-prefill
            const endpointConfig =
              entry.prefillFromGet && entry.getEndpoint
                ? { GET: entry.getEndpoint, PUT: entry.endpoint }
                : { PUT: entry.endpoint };

            return (
              <Div
                key={`nav-${entry.timestamp}-${index}`}
                className={cn(className, !isVisible && "hidden")}
              >
                <EndpointsPage
                  user={user}
                  endpoint={endpointConfig}
                  locale={locale}
                  forceMethod={method}
                  endpointOptions={{
                    // CRITICAL: Pass read options whenever prefillFromGet is true
                    // getEndpoint might be undefined if it was auto-detected, but we still need the urlPathParams
                    ...(entry.prefillFromGet
                      ? {
                          read: {
                            urlPathParams: entry.params.urlPathParams as never,
                          },
                        }
                      : {}),
                    create: {
                      urlPathParams: entry.params.urlPathParams,
                      autoPrefillData: entry.params.data,
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
