"use client";

import type { QueryKey } from "@tanstack/react-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { useCallback, useMemo, useRef } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

import type { EndpointReadOptions } from "../../shared/endpoints/definition/create";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import type { ReactHooksTranslationKey } from "./i18n";
import { executeQuery } from "./query-executor";
import { buildKey, type CacheKeyRequestData } from "./query-key-builder";
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
  user,
}: {
  endpoint: TEndpoint;
  logger: EndpointLogger;
  user: JwtPayloadType;
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
      onSuccess?: (
        data: {
          responseData: TEndpoint["types"]["ResponseOutput"];
          requestData: TEndpoint["types"]["RequestOutput"];
          urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
        },
        user: JwtPayloadType,
        logger: EndpointLogger,
      ) => void | ErrorResponseType | Promise<void | ErrorResponseType>;
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
      refetchInterval?: number | false;
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
    refetchInterval,
    retry = 3,
    // persistToStorage will be used in Phase 3 when we setup persistQueryClient
  } = options;

  // State key: endpoint.path + endpoint.method + urlPathParams + includeInCacheKey fields
  // Shared across all calls with same urlPathParams + cacheKey request data
  const queryKey: QueryKey = useMemo(() => {
    if (customQueryKey) {
      // Custom key is a string, wrap it in array for React Query
      return [customQueryKey];
    }
    // buildKey returns a string, wrap it in array for React Query
    return [
      buildKey(
        "query",
        endpoint,
        urlPathParams,
        logger,
        requestData as CacheKeyRequestData<TEndpoint>,
      ),
    ];
  }, [endpoint, logger, urlPathParams, customQueryKey, requestData]);

  // Prevent cross-request SSR cache contamination:
  // In TanStack Start, the queryClient is a module-level singleton shared across all
  // server-side renders. Without this, User A's cached credits (e.g. 50) would bleed
  // into User B's SSR render, ignoring User B's fresh initialData (e.g. 20 or 0).
  // On the server, force-set initialData into the cache so each request gets its own
  // fresh value. On the client, initialData is set via the useQuery option (standard path).
  if (initialData && typeof window === "undefined") {
    queryClient.setQueryData(queryKey, success(initialData));
  }

  // Use React Query's useQuery hook
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Read fresh value from the Zustand store directly using getState()
      // This ensures we always get the latest value, even when refetch() is called
      // immediately after a store update (before React re-renders)
      const store = useApiStore.getState();
      // Use the same key as useApiQueryForm's storageKey so storedParams lookup matches storage
      const formId = buildKey(
        "query-form",
        endpoint,
        urlPathParams,
        logger,
        requestData as CacheKeyRequestData<TEndpoint>,
      );
      const storedParams = store.getFormQueryParams(formId);

      // When urlPathParams are present (e.g. /threads/:threadId/messages), always prefer
      // requestData because it already has the correct path params merged in by useEndpointRead.
      // storedParams are keyed by endpoint only (not urlPathParams) so they can be stale
      // from a previous navigation to the same endpoint with different path params.
      const hasUrlPathParams =
        urlPathParams !== undefined &&
        urlPathParams !== null &&
        typeof urlPathParams === "object" &&
        Object.keys(urlPathParams as FormQueryParams).length > 0;

      // Check if this endpoint has any includeInCacheKey fields - if so, requestData
      // IS the cache discriminator and must be used directly (storedParams are keyed by
      // endpoint only and would return stale data when switching e.g. targetUserId).
      const hasCacheKeyFields =
        "children" in endpoint.fields &&
        Object.values(
          endpoint.fields.children as Record<
            string,
            { includeInCacheKey?: boolean }
          >,
        ).some((f) => f.includeInCacheKey);

      // Use stored params if available and non-empty, and no urlPathParams override,
      // and no custom queryKey (custom keys indicate per-value caching where requestData
      // is already the correct value - using stored params would return stale data from
      // a previous value, e.g. switching root folder tabs).
      // Also skip stored params when the endpoint uses includeInCacheKey fields, since
      // requestData already carries the correct discriminating values.
      // Otherwise fall back to the prop value.
      // Deserialize any JSON-stringified nested objects
      const hasStoredParams =
        !hasUrlPathParams &&
        !customQueryKey &&
        !hasCacheKeyFields &&
        storedParams !== undefined &&
        storedParams !== null &&
        Object.keys(storedParams).length > 0;
      const currentRequestData = hasStoredParams
        ? deserializeQueryParams<TEndpoint["types"]["RequestOutput"]>(
            storedParams as FormQueryParams,
          )
        : requestData;

      const response = await executeQuery<TEndpoint>({
        endpoint,
        logger,
        requestData: currentRequestData,
        pathParams: urlPathParams,
        locale,
        user,
        options: {
          onSuccess: async (context) => {
            // Call endpoint-defined onSuccess first (from endpoint.options.queryOptions.onSuccess)
            const endpointReadOptions =
              endpoint.options && "queryOptions" in endpoint.options
                ? (endpoint.options as EndpointReadOptions<
                    TEndpoint["types"]["RequestOutput"],
                    TEndpoint["types"]["ResponseOutput"],
                    TEndpoint["types"]["UrlVariablesOutput"]
                  >)
                : undefined;
            if (endpointReadOptions?.queryOptions?.onSuccess) {
              const endpointResult =
                await endpointReadOptions.queryOptions.onSuccess(
                  {
                    responseData: context.responseData,
                    requestData: context.requestData,
                    urlPathParams: context.urlPathParams,
                  },
                  user,
                  logger,
                );
              if (endpointResult) {
                return endpointResult;
              }
            }

            // Then call hook-provided onSuccess (from useApiQuery options)
            if (onSuccess) {
              const result = await onSuccess(
                {
                  responseData: context.responseData,
                  requestData: context.requestData,
                  urlPathParams: context.urlPathParams,
                },
                user,
                logger,
              );
              return result;
            }
          },
          onError,
        },
      });

      return response;
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchInterval,
    retry,
    // Keep showing previous data during background refetches (tab switch, window refocus)
    // Prevents components from flashing empty state while refetch is in flight
    placeholderData: keepPreviousData,
    // initialData populates the cache and respects staleTime.
    // initialDataUpdatedAt is required - without it React Query treats the data as
    // infinitely stale and immediately refetches, defeating the purpose of initialData.
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
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });

  // Stable refetch function - use ref to avoid depending on query object (new every render)
  const queryRef = useRef(query);
  queryRef.current = query;
  const refetch = useCallback(async () => {
    const result = await queryRef.current.refetch();
    return result.data ?? queryRef.current.data ?? success(undefined as never);
  }, []);

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
    // isLoadingFresh = true when: genuinely loading (no cache hit), OR showing placeholder
    // data from a previous query key (keepPreviousData active during key change).
    // Widgets use isLoadingFresh to decide whether to show a spinner vs. stale data.
    const isLoadingFresh = query.isLoading || query.isPlaceholderData;
    const isCachedData =
      !!query.data && !query.isLoading && !query.isPlaceholderData;
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
              ? ("store.status.success" satisfies ReactHooksTranslationKey)
              : isError
                ? ("store.errors.request_failed" satisfies ReactHooksTranslationKey)
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
  }, [
    query.data,
    query.status,
    query.isLoading,
    query.isFetching,
    query.isPlaceholderData,
    query.isError,
    query.isSuccess,
    enabled,
    refetch,
    remove,
    setErrorType,
  ]);
}
