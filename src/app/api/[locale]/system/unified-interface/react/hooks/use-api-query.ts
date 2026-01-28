"use client";

import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { useCallback, useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { executeQuery } from "./query-executor";
import { buildKey } from "./query-key-builder";
import {
  deserializeQueryParams,
  type FormQueryParams,
  queryClient,
  useApiStore,
} from "./store";
import type { ApiQueryReturn } from "./types";

/**
 * React Query hook for API queries
 *
 * Cache key: endpoint.path + endpoint.method + urlPathParams
 * Multiple calls with same urlPathParams share the same cache.
 *
 * @param endpoint - The endpoint to call
 * @param requestData - Request data for the API call
 * @param urlPathParams - URL path parameters
 * @param options - Query options
 * @param logger - Logger instance
 * @returns Query result with loading states and data
 */
export function useApiQuery<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  requestData,
  urlPathParams,
  options,
  logger,
}: {
  endpoint: TEndpoint;
  logger: EndpointLogger;
} & (TEndpoint["types"]["RequestOutput"] extends never
  ? { requestData?: never }
  : {
      requestData: TEndpoint["types"]["RequestOutput"];
    }) &
  (TEndpoint["types"]["UrlVariablesOutput"] extends never
    ? { urlPathParams?: never }
    : {
        urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      }) & {
    options: {
      queryKey?: string;
      enabled?: boolean;
      staleTime?: number;
      gcTime?: number;
      onSuccess?: (data: {
        responseData: TEndpoint["types"]["ResponseOutput"];
        requestData: TEndpoint["types"]["RequestOutput"];
        urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;
      onError?: ({
        error,
        requestData,
        urlPathParams,
      }: {
        error: ErrorResponseType;
        requestData: TEndpoint["types"]["RequestOutput"];
        urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      }) => void | Promise<void>;
      refetchOnWindowFocus?: boolean;
      retry?: number;
      initialData?: TEndpoint["types"]["ResponseOutput"];
      persistToStorage?: boolean;
    };
  }): ApiQueryReturn<TEndpoint["types"]["ResponseOutput"]> {
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

  // State key: endpoint.path + endpoint.method + urlPathParams
  // Shared across all calls with same urlPathParams
  const queryKey: QueryKey = useMemo(() => {
    if (customQueryKey) {
      // Custom key is a string, wrap it in array for React Query
      return [customQueryKey];
    }
    // buildKey returns a string, wrap it in array for React Query
    return [buildKey("query", endpoint, urlPathParams, logger)];
  }, [endpoint, logger, urlPathParams, customQueryKey]);

  // Use React Query's useQuery hook
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Read fresh value from the Zustand store directly using getState()
      // This ensures we always get the latest value, even when refetch() is called
      // immediately after a store update (before React re-renders)
      const store = useApiStore.getState();
      const formId = store.getFormId(endpoint);
      const storedParams = store.getFormQueryParams(formId);

      // Use stored params if available and non-empty, otherwise fall back to the prop value
      // Deserialize any JSON-stringified nested objects
      const hasStoredParams =
        storedParams && Object.keys(storedParams).length > 0;
      const currentRequestData = hasStoredParams
        ? deserializeQueryParams<TEndpoint["types"]["RequestOutput"]>(
            storedParams as FormQueryParams,
          )
        : requestData;

      logger.info("useApiQuery: Executing query", {
        endpointPath: endpoint.path.join("/"),
        queryKeyString: JSON.stringify(queryKey),
      });

      const response = await executeQuery({
        endpoint: endpoint as never,
        logger,
        requestData: currentRequestData as never,
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
      ? (): ResponseType<TEndpoint["types"]["ResponseOutput"]> => {
          logger.debug("useApiQuery: Using initialData", {
            endpointPath: endpoint.path.join("/"),
            hasInitialData: !!initialData,
            initialDataKeys: Object.keys(initialData ?? {}),
          });
          return success(initialData);
        }
      : undefined,
  });

  // Stable refetch function
  const refetch = useCallback(async () => {
    const result = await query.refetch();
    return result.data ?? query.data ?? success(undefined as never);
  }, [query]);

  // Stable remove function
  const remove = useCallback(() => {
    queryClient.removeQueries({ queryKey });
  }, [queryKey]);

  // Stable setErrorType function
  const setErrorType = useCallback(
    (newError: ErrorResponseType | null) => {
      if (newError) {
        queryClient.setQueryData(
          queryKey,
          newError as ResponseType<TEndpoint["types"]["ResponseOutput"]>,
        );
      } else {
        queryClient.setQueryData(queryKey, undefined);
      }
    },
    [queryKey],
  );

  // Map React Query state to our custom return type
  return useMemo(() => {
    type QueryStatus = "loading" | "error" | "success" | "idle";

    const responseData = query.data;
    const data = responseData?.success ? responseData.data : undefined;
    const error = responseData?.success === false ? responseData : undefined;

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
    const isLoadingFresh = query.isLoading;
    const isCachedData = !!query.data && !query.isLoading;
    const isError = query.isError || responseData?.success === false;
    const isSuccess = query.isSuccess && responseData?.success === true;

    const statusMessage = (
      !enabled
        ? "app.error.api.store.status.disabled"
        : isLoadingFresh
          ? "app.error.api.store.status.loading_data"
          : isCachedData && !isFetching
            ? "app.error.api.store.status.cached_data"
            : isSuccess
              ? "app.api.system.unifiedInterface.react.hooks.store.status.success"
              : isError
                ? "app.api.system.unifiedInterface.react.hooks.store.errors.request_failed"
                : undefined
    ) as ApiQueryReturn<TEndpoint["types"]["ResponseOutput"]>["statusMessage"];

    return {
      response: responseData,
      data,
      error,
      isError,
      isSuccess,
      isLoading,
      isFetching,
      isLoadingFresh,
      isCachedData,
      statusMessage,
      status,
      refetch,
      remove,
      setErrorType,
    };
  }, [query, enabled, refetch, remove, setErrorType]);
}
