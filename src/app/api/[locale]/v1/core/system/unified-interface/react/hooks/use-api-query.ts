"use client";

import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { useMemo } from "react";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { useTranslation } from "@/i18n/core/client";

import { executeQuery } from "./query-executor";
import { buildQueryKey } from "./query-key-builder";
import type { ApiQueryReturn } from "./types";

/**
 * React Query hook for API queries with type-safe responses
 *
 * This hook uses React Query as the single source of truth for query state.
 * It provides:
 * - Automatic caching and deduplication
 * - Background refetching
 * - Optimistic updates via queryClient.setQueryData
 * - Type-safe callbacks with our custom error/response shapes
 *
 * @param endpoint - The endpoint to call
 * @param requestData - Request data for the API call
 * @param urlPathParams - URL parameters for the API call
 * @param options - Query options
 * @param logger - Logger instance
 * @returns Enhanced query result with loading states and data
 */
export function useApiQuery<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly UserRoleValue[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
>({
  endpoint,
  requestData,
  urlPathParams,
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
    ? { urlPathParams?: never }
    : {
        urlPathParams: TEndpoint["TUrlVariablesOutput"];
      }) & {
    options: {
      queryKey?: QueryKey;
      enabled?: boolean;
      staleTime?: number;
      gcTime?: number;
      onSuccess?: (data: {
        responseData: TEndpoint["TResponseOutput"];
        requestData: TEndpoint["TRequestOutput"];
        urlPathParams: TEndpoint["TUrlVariablesOutput"];
      }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;
      onError?: ({
        error,
        requestData,
        urlPathParams,
      }: {
        error: ErrorResponseType;
        requestData: TEndpoint["TRequestOutput"];
        urlPathParams: TEndpoint["TUrlVariablesOutput"];
      }) => void | Promise<void>;
      refetchOnWindowFocus?: boolean;
      retry?: number;
      initialData?: TEndpoint["TResponseOutput"];
      persistToStorage?: boolean;
    };
  }): ApiQueryReturn<TEndpoint["TResponseOutput"]> {
  const { locale } = useTranslation();

  const {
    queryKey: customQueryKey,
    initialData,
    onSuccess,
    onError,
    enabled = true,
    staleTime = 60_000, // 60 seconds default
    gcTime,
    refetchOnWindowFocus = false,
    retry = 3,
    // persistToStorage will be used in Phase 3 when we setup persistQueryClient
  } = options;

  // Create a stable query key using shared utility
  // This queryKey serves dual purpose:
  // 1. React Query cache identification
  // 2. Persistence key (when persistQueryClient is setup)
  const queryKey: QueryKey = useMemo(
    () =>
      buildQueryKey(
        endpoint,
        logger,
        requestData,
        urlPathParams,
        customQueryKey,
      ),
    [endpoint, logger, requestData, urlPathParams, customQueryKey],
  );

  // Use React Query's useQuery hook
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      logger.info("useApiQuery: Executing query", {
        endpointPath: endpoint.path.join("/"),
        queryKeyString: JSON.stringify(queryKey),
      });

      const response = await executeQuery({
        endpoint: endpoint as never,
        logger,
        requestData: requestData as never,
        pathParams: urlPathParams as never,
        locale,
        options: {
          onSuccess: onSuccess
            ? (
                context,
              ):
                | void
                | ErrorResponseType
                | Promise<void | ErrorResponseType> => {
                const result = onSuccess({
                  responseData: context.responseData,
                  requestData: context.requestData,
                  urlPathParams: context.urlPathParams,
                });
                return result;
              }
            : undefined,
          onError,
        },
      });

      return response;
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    // initialData populates the cache and respects staleTime
    // This allows optimistic updates to work because data is in the cache
    initialData: initialData
      ? (): ResponseType<TEndpoint["TResponseOutput"]> => success(initialData)
      : undefined,
  });

  // Map React Query state to our custom return type
  return useMemo(() => {
    type QueryStatus = "loading" | "error" | "success" | "idle";

    // Extract data from React Query response
    const responseData = query.data;
    const data = responseData?.success ? responseData.data : undefined;
    const error = responseData?.success === false ? responseData : undefined;

    // Map React Query states to our custom states
    // React Query v5 uses "pending" but we map it to "loading" for compatibility
    const status: QueryStatus =
      query.status === "pending"
        ? "loading"
        : query.status === "error"
          ? "error"
          : query.status === "success"
            ? "success"
            : "idle";

    const isLoading = query.isLoading || query.isFetching;
    const isFetching = query.isFetching;
    const isLoadingFresh = query.isLoading; // First load, no data yet
    const isCachedData = !!query.data && !query.isLoading;
    const isError = query.isError || responseData?.success === false;
    const isSuccess = query.isSuccess && responseData?.success === true;

    // Create status message based on state
    const statusMessage = (
      !enabled
        ? "app.error.api.store.status.disabled"
        : isLoadingFresh
          ? "app.error.api.store.status.loading_data"
          : isCachedData && !isFetching
            ? "app.error.api.store.status.cached_data"
            : isSuccess
              ? "app.api.v1.core.system.unifiedInterface.react.hooks.store.status.success"
              : isError
                ? "app.api.v1.core.system.unifiedInterface.react.hooks.store.errors.request_failed"
                : undefined
    ) as ApiQueryReturn<TEndpoint["TResponseOutput"]>["statusMessage"];

    const result: ApiQueryReturn<TEndpoint["TResponseOutput"]> = {
      response: responseData,

      // Backward compatibility properties
      data,
      error,
      isError,
      isSuccess,
      isLoading,
      isFetching,
      isLoadingFresh,
      isCachedData,
      statusMessage,

      // React Query properties
      status,
      refetch: async () => {
        const result = await query.refetch();
        return result.data ?? responseData ?? success(undefined as never);
      },
      remove: () => {
        // React Query v5 doesn't have remove on the query result
        // We'll implement this using queryClient in the future
        logger.warn("remove() is not yet implemented with React Query");
      },

      // Placeholder for setErrorType (deprecated, kept for compatibility)
      setErrorType: (_newError: ErrorResponseType | null) => {
        logger.warn(
          "setErrorType is deprecated, use React Query's error handling instead",
        );
        // This is a no-op now, React Query manages errors
      },
    };

    return result;
  }, [query, enabled, logger]);
}
