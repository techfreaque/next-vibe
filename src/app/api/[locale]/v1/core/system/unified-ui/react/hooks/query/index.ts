"use client";

import type { QueryKey } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { z } from "zod";

import type {
  ExtractOutput,
  FieldUsage,
  InferSchemaFromField,
  UnifiedField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { useTranslation } from "@/i18n/core/client";

import type { EndpointLogger } from "../../../cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "../../../cli/vibe/endpoints/endpoint-types/core/enums";
import type { AnyData, ApiStore, QueryStoreType } from "../store";
import { useApiStore } from "../store";
import type { ApiQueryReturn } from "../types";

/**
 * Serializable value types for safe JSON operations
 */
type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializableObject
  | SerializableValue[];

/**
 * Serializable object type for safe JSON operations
 */
interface SerializableObject {
  [key: string]: SerializableValue;
}

/**
 * React Query hook for GET requests with local storage caching
 * @param endpoint - The endpoint to call
 * @param requestData - Request data for the API call
 * @param urlParams - URL parameters for the API call
 * @param options - Query options
 * @returns Enhanced query result with extra loading state information
 */
export function useApiQuery<
  TEndpoint extends CreateApiEndpoint<any, any, any, any>,
>({
  endpoint,
  requestData,
  urlParams,
  options,
  logger,
}: {
  endpoint: TEndpoint;

  logger: EndpointLogger;
} & (TEndpoint["TRequestOutput"] extends never
  ? { requestData?: never }
  : {
      requestData: TEndpoint["TRequestOutput"];
    }) &
  (TEndpoint["TUrlVariablesOutput"] extends never
    ? { urlParams?: never }
    : {
        urlParams: TEndpoint["TUrlVariablesOutput"];
      }) & {
    options: {
      queryKey?: QueryKey;
      enabled?: boolean;
      staleTime?: number;
      cacheTime?: number;
      onSuccess?: (data: {
        responseData: TEndpoint["TResponseOutput"];
        requestData: TEndpoint["TRequestOutput"];
        urlParams: TEndpoint["TUrlVariablesOutput"];
      }) => void;
      onError?: ({
        error,
        requestData,
        urlParams,
      }: {
        error: ErrorResponseType;
        requestData: TEndpoint["TRequestOutput"];
        urlParams: TEndpoint["TUrlVariablesOutput"];
      }) => void;
      disableLocalCache?: boolean;
      refreshDelay?: number;
      /**
       * Whether to skip initial fetch when component mounts
       * @default false
       */
      skipInitialFetch?: boolean;
      /**
       * Whether to refetch when dependencies change
       * @default true
       */
      refetchOnWindowFocus?: boolean;
      retry?: number;
      refetchOnDependencyChange?: boolean;
      initialData?: TEndpoint["TResponseOutput"];
    };
  }): ApiQueryReturn<TEndpoint["TResponseOutput"]> {
  const {
    queryKey: customQueryKey,
    skipInitialFetch = false,
    refetchOnDependencyChange = true,
    initialData,
    ...queryOptions
  } = options;

  const { t, locale } = useTranslation();

  // Create a stable query key
  const queryKey: QueryKey = useMemo(() => {
    // Create a stable representation of the endpoint
    const endpointKey = `${endpoint.path.join("/")}:${endpoint.method}`;

    // Create a stable representation of the request data
    let requestDataKey: string | undefined;
    if (requestData) {
      try {
        // For objects, create a stable JSON representation
        if (typeof requestData === "object") {
          // Filter out internal properties and handle circular references
          const safeRequestData = JSON.stringify(
            requestData,
            (key: string, value: SerializableValue) => {
              // Skip internal properties
              if (key.startsWith("_")) {
                return undefined;
              }
              // Handle circular references and complex objects
              if (typeof value === "object" && value !== null) {
                // Return a simplified version of objects
                const valueAsObject = value as SerializableObject;
                if (Object.keys(valueAsObject).length > 0) {
                  // Create a safe representation of the object
                  const safeObject: SerializableObject = {};
                  // Filter and transform entries
                  for (const [k, v] of Object.entries(valueAsObject)) {
                    if (!k.startsWith("_")) {
                      safeObject[k] =
                        // eslint-disable-next-line i18next/no-literal-string
                        typeof v === "function" ? "[Function]" : v;
                    }
                  }
                  return safeObject;
                } else {
                  return value;
                }
              }
              return value as string | number | boolean | null;
            },
          );
          requestDataKey = safeRequestData;
        } else {
          // For primitives, use string representation
          requestDataKey = String(requestData);
        }
      } catch (err) {
        // If JSON stringification fails, use a fallback
        logger.error("Failed to stringify request data:", err);
        requestDataKey =
          typeof requestData === "object"
            ? Object.keys(requestData).sort().join(",")
            : String(requestData);
      }
    }

    // Create a stable representation of URL parameters
    let urlParamsKey: string | undefined;
    if (urlParams) {
      try {
        // For objects, create a stable JSON representation
        if (typeof urlParams === "object") {
          // Filter out internal properties and handle circular references
          urlParamsKey = JSON.stringify(
            urlParams,
            (key: string, value: SerializableValue) => {
              // Skip internal properties
              if (key.startsWith("_")) {
                return undefined;
              }
              // Handle circular references and complex objects
              if (typeof value === "object" && value !== null) {
                // Return a simplified version of objects
                const valueAsObject = value as SerializableObject;
                if (Object.keys(valueAsObject).length > 0) {
                  // Create a safe representation of the object
                  const safeObject: SerializableObject = {};
                  // Filter and transform entries
                  for (const [k, v] of Object.entries(valueAsObject)) {
                    if (!k.startsWith("_")) {
                      safeObject[k] =
                        // eslint-disable-next-line i18next/no-literal-string
                        typeof v === "function" ? "[Function]" : v;
                    }
                  }
                  return safeObject;
                } else {
                  return value;
                }
              }
              return value as string | number | boolean | null;
            },
          );
        } else {
          // For primitives, use string representation
          urlParamsKey = String(urlParams);
        }
      } catch (err) {
        // If JSON stringification fails, use a fallback
        // Log the error for debugging
        logger.error("Failed to stringify URL parameters:", err);
        urlParamsKey =
          typeof urlParams === "object"
            ? Object.keys(urlParams).sort().join(",")
            : String(urlParams);
      }
    }

    // Return the custom query key or build one from the components
    return customQueryKey ?? [endpointKey, requestDataKey, urlParamsKey];
  }, [
    endpoint.path,
    endpoint.method,
    requestData,
    urlParams,
    customQueryKey,
    logger,
  ]);

  // Get API store methods
  const { executeQuery, getQueryId } = useApiStore();

  // Get query ID
  const queryId = useMemo(() => getQueryId(queryKey), [getQueryId, queryKey]);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Create default state based on enabled option and existing store data
  const defaultState: QueryStoreType<TEndpoint["TResponseOutput"]> =
    useMemo(() => {
      if (options.enabled === false) {
        return {
          response: undefined,
          data: undefined,
          error: null,
          isLoading: false,
          isFetching: false,
          isError: false,
          isSuccess: false,
          isLoadingFresh: false,
          isCachedData: false,
          statusMessage: "error.api.store.status.disabled" as const,
          lastFetchTime: null,
        };
      }

      // Check if we already have data in the store to avoid unnecessary loading states
      const existingQuery = useApiStore.getState().queries[queryId];
      if (existingQuery?.response?.success) {
        // We have existing successful data, use it as the default state but not loading
        return {
          ...existingQuery,
          isLoading: false,
          isFetching: false,
          isLoadingFresh: false,
          isCachedData: true,
        } as QueryStoreType<TEndpoint["TResponseOutput"]>;
      }

      // No existing data, start with loading state
      return {
        response: undefined,
        data: initialData,
        error: null,
        isLoading: true,
        isFetching: true,
        isError: false,
        isSuccess: false,
        isLoadingFresh: true,
        isCachedData: false,
        statusMessage: "error.api.store.status.loading_data",
        lastFetchTime: null,
      };
    }, [initialData, options.enabled, queryId]);

  // Create a selector function for the store
  const selector = useCallback(
    (state: ApiStore): QueryStoreType<TEndpoint["TResponseOutput"]> => {
      const query = state.queries[queryId];
      return (
        (query as QueryStoreType<TEndpoint["TResponseOutput"]>) ?? defaultState
      );
    },
    [queryId, defaultState],
  );

  // Get query state from store with shallow comparison
  const queryState = useApiStore(selector);

  // Track the last execution time to prevent excessive API calls
  const lastExecutionTimeRef = useRef<number>(0);
  const isExecutingRef = useRef<boolean>(false);
  const minExecutionInterval = 2000; // Minimum 2 seconds between executions

  // Create a stable execution key that changes only when the actual query should change
  const executionKey = useMemo(() => {
    // Include requestData in the execution key so parameter changes trigger re-execution
    const requestDataKey = requestData ? JSON.stringify(requestData) : "null";
    // eslint-disable-next-line i18next/no-literal-string
    return `${queryKey.join("|")}|${options.enabled}|${locale}|${requestDataKey}`;
  }, [queryKey, options.enabled, locale, requestData]);

  // Execute query when component mounts or dependencies change
  useEffect(() => {
    // Skip if query is disabled
    if (options.enabled === false) {
      logger.info("useApiQuery: Query disabled, skipping", {
        endpointPath: endpoint.path,
      });
      return;
    }

    // Skip if we're in the middle of a navigation (document is hidden)
    if (typeof document !== "undefined" && document.hidden) {
      logger.info(
        "useApiQuery: Document hidden (navigation in progress), skipping",
        {
          endpointPath: endpoint.path,
        },
      );
      return;
    }

    // Skip initial fetch if requested
    if (isInitialMount.current && skipInitialFetch) {
      logger.debug("useApiQuery: Skipping initial fetch", {
        endpointPath: endpoint.path,
      });
      isInitialMount.current = false;
      return;
    }

    // Skip dependency-based refetch if requested
    if (!isInitialMount.current && !refetchOnDependencyChange) {
      logger.debug("useApiQuery: Skipping dependency-based refetch", {
        endpointPath: endpoint.path,
      });
      return;
    }

    // Check if we're already executing
    if (isExecutingRef.current) {
      logger.debug("useApiQuery: Already executing, skipping", {
        endpointPath: endpoint.path,
      });

      // Safety mechanism: If we've been executing for more than 5 seconds, force reset
      // Only check if lastExecutionTimeRef has been set (not 0)
      if (lastExecutionTimeRef.current > 0) {
        const timeSinceLastExecution =
          Date.now() - lastExecutionTimeRef.current;
        if (timeSinceLastExecution > 5000) {
          logger.error(
            "useApiQuery: Execution stuck, force resetting executing flag",
            {
              endpointPath: endpoint.path,
              timeSinceLastExecution,
            },
          );
          isExecutingRef.current = false;
          // Don't return, let the execution continue
        } else {
          return;
        }
      } else {
        // If lastExecutionTimeRef is 0, just return to avoid the stuck state
        return;
      }
    }

    // Check if we're executing too frequently
    const now = Date.now();
    // Only throttle if we have a previous execution time (not 0)
    if (
      lastExecutionTimeRef.current > 0 &&
      now - lastExecutionTimeRef.current < minExecutionInterval
    ) {
      logger.debug("useApiQuery: Executing too frequently, throttling", {
        endpointPath: endpoint.path,
        timeSinceLastExecution: now - lastExecutionTimeRef.current,
        minInterval: minExecutionInterval,
      });
      // We're executing too frequently, wait a bit
      const timeoutId = setTimeout(
        () => {
          // Check if we already have data in the store
          const existingQuery = useApiStore.getState().queries[queryId];
          const hasValidData = Boolean(existingQuery?.response?.success);
          const isFresh =
            existingQuery?.lastFetchTime &&
            Date.now() - existingQuery.lastFetchTime <
              (queryOptions.staleTime || 60_000);

          // Skip fetch if we have fresh data (even on initial mount if data exists)
          if (hasValidData && isFresh) {
            return;
          }

          // Mark as executing
          isExecutingRef.current = true;

          // Wrap the execution in a try-catch to ensure isExecutingRef is always reset
          const executeWithCleanup = async (): Promise<void> => {
            try {
              await executeQuery(
                endpoint,
                logger,
                requestData,
                urlParams,
                t,
                locale,
                {
                  ...queryOptions,
                  queryKey,
                  // Ensure onError has the correct signature
                  onError: queryOptions.onError
                    ? ({ error }: { error: ErrorResponseType }): void => {
                        if (queryOptions.onError) {
                          queryOptions.onError({
                            error,
                            requestData: requestData!,
                            urlParams: urlParams!,
                          });
                        }
                      }
                    : undefined,
                },
              );
            } catch (error) {
              logger.error("useApiQuery: Throttled query execution failed", {
                endpointPath: endpoint.path,
                error,
              });
            } finally {
              // Mark as no longer executing
              isExecutingRef.current = false;
              // Update execution time
              lastExecutionTimeRef.current = Date.now();
              logger.debug(
                "useApiQuery: Throttled execution completed, reset isExecutingRef",
                {
                  endpointPath: endpoint.path,
                },
              );
            }
          };

          void executeWithCleanup();

          // Update initial mount ref
          isInitialMount.current = false;
        },
        minExecutionInterval - (now - lastExecutionTimeRef.current),
      );

      return (): void => clearTimeout(timeoutId);
    }

    // Check if we already have data in the store
    const existingQuery = useApiStore.getState().queries[queryId];
    const hasValidData = Boolean(existingQuery?.response?.success);
    const isFresh =
      existingQuery?.lastFetchTime &&
      Date.now() - existingQuery.lastFetchTime <
        (queryOptions.staleTime || 60_000);

    // Skip fetch if we have fresh data (even on initial mount if data exists)
    if (hasValidData && isFresh) {
      return;
    }

    // Mark as executing
    isExecutingRef.current = true;

    // Add a safety timeout to reset the executing flag if the query hangs
    const safetyTimeoutId = setTimeout(() => {
      logger.error(
        "useApiQuery: Safety timeout triggered, resetting executing flag",
        {
          endpointPath: endpoint.path,
        },
      );
      isExecutingRef.current = false;
    }, 2000); // 2 second safety timeout - queries should complete faster

    // Mark as executing and update execution time
    isExecutingRef.current = true;
    lastExecutionTimeRef.current = Date.now();
    isInitialMount.current = false;

    // Execute the query immediately but with proper cleanup
    // Wrap the execution in a try-catch to ensure isExecutingRef is always reset
    const executeWithCleanup = async (): Promise<void> => {
      let executionCompleted = false;
      try {
        await executeQuery(
          endpoint,
          logger,
          requestData,
          urlParams,
          t,
          locale,
          {
            ...queryOptions,
            queryKey,
            // Ensure onError has the correct signature
            onError: queryOptions.onError
              ? ({ error }: { error: ErrorResponseType }): void => {
                  if (queryOptions.onError) {
                    queryOptions.onError({
                      error,
                      requestData: requestData!,
                      urlParams: urlParams!,
                    });
                  }
                }
              : undefined,
          },
        );

        executionCompleted = true;
        logger.debug("useApiQuery: Query execution successful", {
          endpointPath: endpoint.path,
        });
      } catch (error) {
        executionCompleted = true;
        logger.error("useApiQuery: Query execution failed", {
          endpointPath: endpoint.path,
          error,
        });
      } finally {
        // Clear the safety timeout
        clearTimeout(safetyTimeoutId);
        // Mark as no longer executing
        isExecutingRef.current = false;
        // Update execution time
        lastExecutionTimeRef.current = Date.now();
        logger.debug("useApiQuery: Execution completed, reset isExecutingRef", {
          endpointPath: endpoint.path,
          executionCompleted,
          wasSuccessful: executionCompleted,
        });
      }
    };

    void executeWithCleanup();

    // Update initial mount ref
    isInitialMount.current = false;

    // Return cleanup function for the safety timeout
    return (): void => clearTimeout(safetyTimeoutId);

    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    executionKey, // This is our stable key that includes all necessary dependencies
  ]);

  // Refetch function
  const refetch = useCallback(async (): Promise<
    ResponseType<TEndpoint["TResponseOutput"]>
  > => {
    try {
      const response = await executeQuery(
        endpoint,
        logger,
        requestData,
        urlParams,
        t,
        locale,
        {
          ...queryOptions,
          queryKey,
          disableLocalCache: true, // Force refetch
          // Ensure onError has the correct signature
          onError: queryOptions.onError
            ? ({ error }: { error: ErrorResponseType }): void => {
                if (queryOptions.onError) {
                  queryOptions.onError({
                    error,
                    requestData: requestData!,
                    urlParams: urlParams!,
                  });
                }
              }
            : undefined,
        },
      );

      // Ensure we return a proper ResponseType
      return typeof response === "object" &&
        response !== null &&
        "success" in response
        ? response
        : createSuccessResponse(response);
    } catch (error) {
      // Create a properly typed error response
      return createErrorResponse(
        "app.common.errors.unknown" as const,
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: error instanceof Error ? error.message : String(error) },
      );
    }
  }, [
    executeQuery,
    endpoint,
    requestData,
    urlParams,
    t,
    locale,
    queryOptions,
    queryKey,
    logger,
  ]);

  // Remove function
  const remove = useCallback(() => {
    // Clear from in-memory state
    useApiStore.setState((state) => {
      const queries = { ...state.queries };
      delete queries[queryId];
      return { queries };
    });
  }, [queryId]);

  // Helper function for updating query state
  const updateQueryState = useCallback(
    (updates: Partial<QueryStoreType<TEndpoint["TResponseOutput"]>>) => {
      useApiStore.setState((state) => {
        const queries = { ...state.queries };
        const existingQuery = queries[queryId];
        if (existingQuery) {
          queries[queryId] = {
            ...existingQuery,
            ...updates,
          } as QueryStoreType<AnyData>;
        }
        return { queries };
      });
    },
    [queryId],
  );

  // Create a result object that matches React Query's API
  return useMemo(() => {
    type QueryStatus = "loading" | "error" | "success" | "idle";

    const status: QueryStatus =
      queryState.isLoading || queryState.isFetching
        ? "loading"
        : queryState.isError
          ? "error"
          : queryState.isSuccess
            ? "success"
            : "idle";

    // Function to set error type
    const setErrorType = (error: ErrorResponseType | null): void => {
      updateQueryState({
        error,
        isError: !!error,
        isSuccess: !error && !!queryState.data,
      });
    };

    // Create the response object
    const response: ResponseType<TEndpoint["TResponseOutput"]> | undefined =
      queryState.isSuccess
        ? createSuccessResponse(queryState.data as TEndpoint["TResponseOutput"])
        : queryState.isError && queryState.error
          ? queryState.error
          : undefined;

    const result: ApiQueryReturn<TEndpoint["TResponseOutput"]> = {
      response,
      // Backward compatibility properties
      data: queryState.data,
      error: queryState.error ?? undefined,
      isError: queryState.isError,
      isSuccess: queryState.isSuccess,

      isLoading: queryState.isLoading || queryState.isFetching,
      isFetching: queryState.isFetching,
      isLoadingFresh: queryState.isLoadingFresh,
      isCachedData: queryState.isCachedData,
      statusMessage: queryState.statusMessage,

      // Add additional methods/properties to match React Query's API
      status,
      refetch,
      remove,
      setErrorType,
    };

    return result;
  }, [queryState, refetch, remove, updateQueryState]);
}
