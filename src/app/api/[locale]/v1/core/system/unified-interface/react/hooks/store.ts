import type { QueryKey } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import {
  isErrorResponseType,
  parseError,
} from "next-vibe/shared/utils/parse-error";
import { z } from "zod";
import { create } from "zustand";

import { generateStorageKey } from "@/app/api/[locale]/v1/core/system/unified-interface/react/storage-storage-client";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/storage";
import { callApi, containsFile, objectToFormData } from "./api-utils";
import type { ApiMutationOptions, ApiQueryOptions } from "./types";

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Type alias for any data that can be stored
export type AnyData =
  | Record<string, never>
  | Record<string, string | number | boolean | null | undefined>
  | string
  | number
  | boolean
  | null
  | undefined;

// Generic type for custom state values - must be compatible with AnyData
type CustomStateValue = string | number | boolean | null | undefined;

// Track in-flight requests to prevent duplicates
const inFlightRequests = new Map<
  string,
  { promise: Promise<AnyData>; timestamp: number }
>();

// Throttle map to prevent excessive API calls
const throttleMap = new Map<string, number>();
const THROTTLE_INTERVAL = 500; // ms

// Clean up in-flight requests older than 10 seconds
const MAX_REQUEST_AGE = 10_000; // 10 seconds

// Set a maximum number of in-flight requests to prevent memory leaks
const MAX_IN_FLIGHT_REQUESTS = 50;

// Function to clean up old in-flight requests
function cleanupInFlightRequests(): void {
  const now = Date.now();

  // First, clean up old requests
  for (const [key, { timestamp }] of inFlightRequests.entries()) {
    if (now - timestamp > MAX_REQUEST_AGE) {
      inFlightRequests.delete(key);
    }
  }

  // If we have too many requests, remove the oldest ones
  if (inFlightRequests.size > MAX_IN_FLIGHT_REQUESTS) {
    // Convert to array, sort by timestamp, and keep only the newest MAX_IN_FLIGHT_REQUESTS
    const entries = [...inFlightRequests.entries()];
    const sortedEntries = entries.toSorted(
      (a, b) => b[1].timestamp - a[1].timestamp,
    ); // Sort newest first

    // Keep only the newest MAX_IN_FLIGHT_REQUESTS
    const toKeep = sortedEntries.slice(0, MAX_IN_FLIGHT_REQUESTS);

    // Clear the map and add back only the ones we want to keep
    inFlightRequests.clear();
    for (const [key, value] of toKeep) {
      inFlightRequests.set(key, value);
    }
  }
}

// Type definitions for better type safety
interface QueryStoreMap {
  [key: string]: QueryStoreType<AnyData>;
}

interface MutationStoreMap {
  [key: string]: MutationStoreType<AnyData>;
}

interface FormStoreItem {
  formError: ErrorResponseType | null;
  isSubmitting: boolean;
  queryParams?: FormQueryParams;
}

interface FormStoreMap {
  [key: string]: FormStoreItem;
}

export interface FormQueryParams {
  [key: string]: string | number | boolean;
}

interface CustomStateMap {
  [key: string]: AnyData;
}

interface TimeoutMap {
  [key: string]: () => void;
}

// Typed custom state utilities
export interface TypedCustomStateKey<T extends CustomStateValue> {
  readonly key: string;
  readonly _type?: T; // Phantom type for TypeScript inference
}

export type TypedCustomStateSelector<T extends CustomStateValue> = (
  state: ApiStore,
) => T;

export type TypedCustomStateSetter<T extends CustomStateValue> = (
  value: T,
) => void;

// Helper function to create a typed custom state key
export function createCustomStateKey<T extends CustomStateValue>(
  key: string,
): TypedCustomStateKey<T> {
  return { key } as TypedCustomStateKey<T>;
}

// Helper function to create a typed selector
export function createCustomStateSelector<T extends CustomStateValue>(
  stateKey: TypedCustomStateKey<T>,
  defaultValue: T,
): TypedCustomStateSelector<T> {
  return (state: ApiStore): T => {
    const value = state.customState[stateKey.key];
    return (value as T) ?? defaultValue;
  };
}

// Helper function to create a typed setter
export function createCustomStateSetter<T extends CustomStateValue>(
  stateKey: TypedCustomStateKey<T>,
): TypedCustomStateSetter<T> {
  return (value: T): void => {
    useApiStore.setState((state) => ({
      customState: {
        ...state.customState,
        [stateKey.key]: value,
      },
    }));
  };
}

// Convenience hook for using typed custom state
export function useCustomState<T extends CustomStateValue>(
  stateKey: TypedCustomStateKey<T>,
  defaultValue: T,
): [T, TypedCustomStateSetter<T>] {
  const selector = createCustomStateSelector(stateKey, defaultValue);
  const setter = createCustomStateSetter(stateKey);
  const value = useApiStore(selector);
  return [value, setter];
}

// Store types
export interface ApiStore {
  // Query state
  queries: QueryStoreMap;

  // Mutation state
  mutations: MutationStoreMap;

  // Form state
  forms: FormStoreMap;

  customState: CustomStateMap;

  // Methods
  executeQuery: <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["TRequestOutput"],
    pathParams: TEndpoint["TUrlVariablesOutput"],
    t: TFunction,
    locale: CountryLanguage,
    options?: Omit<
      ApiQueryOptions<
        TEndpoint["TRequestOutput"],
        TEndpoint["TResponseOutput"],
        TEndpoint["TUrlVariablesOutput"]
      >,
      "queryKey"
    > & {
      queryKey?: QueryKey;
    },
  ) => Promise<ResponseType<TEndpoint["TResponseOutput"]>>;

  executeMutation: <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["TRequestOutput"],
    pathParams: TEndpoint["TUrlVariablesOutput"],
    t: TFunction,
    locale: CountryLanguage,
    options?: ApiMutationOptions<
      TEndpoint["TRequestOutput"],
      TEndpoint["TResponseOutput"],
      TEndpoint["TUrlVariablesOutput"]
    >,
  ) => Promise<ResponseType<TEndpoint["TResponseOutput"]>>;

  invalidateQueries: (queryKey: QueryKey) => Promise<void>;
  refetchQuery: <TResponse>(
    queryKey: QueryKey,
  ) => Promise<ResponseType<TResponse | undefined>>;

  setFormError: (formId: string, error: ErrorResponseType | null) => void;
  clearFormError: (formId: string) => void;

  // Helper to generate unique IDs
  getQueryId: (queryKey: QueryKey) => string;
  getMutationId: (endpoint: {
    readonly method: Methods;
    readonly path: readonly string[];
  }) => string;
  getFormId: (endpoint: {
    readonly method: Methods;
    readonly path: readonly string[];
  }) => string;

  setFormQueryParams: (formId: string, params: FormQueryParams) => void;
  getFormQueryParams: <T>(formId: string) => T | undefined;

  updateEndpointData: <
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >,
  >(
    endpoint: TEndpoint,
    updater: (
      oldData:
        | {
          success: boolean;
          data: TEndpoint["TResponseOutput"];
        }
        | undefined,
    ) =>
      | {
        success: boolean;
        data: TEndpoint["TResponseOutput"];
      }
      | undefined,
    requestData?: TEndpoint["TRequestOutput"],
    urlPathParams?: TEndpoint["TUrlVariablesOutput"],
  ) => void;
}

export interface QueryStoreType<TResponse> {
  /** The complete response including success/error state */
  response: ResponseType<TResponse> | undefined;

  // Backward compatibility properties
  /** @deprecated Use response.success and response.data instead */
  data: TResponse | undefined;
  /** @deprecated Use response.success === false ? response : undefined instead */
  error: ErrorResponseType | null;
  /** @deprecated Use !response?.success instead */
  isError: boolean;
  /** @deprecated Use response?.success === true instead */
  isSuccess: boolean;

  isLoading: boolean;
  isFetching: boolean;
  isLoadingFresh: boolean;
  isCachedData: boolean;
  /** @deprecated Use response?.message instead */
  statusMessage: TranslationKey | undefined;
  lastFetchTime: number | null;
}

export interface MutationStoreType<TResponse> {
  /** The complete response including success/error state */
  response: ResponseType<TResponse> | undefined;
  isSuccess: boolean;
  data: TResponse | undefined;
  isError: boolean;
  isPending: boolean;

  // Backward compatibility properties
  /** @deprecated Use response?.success === false ? response : null instead */
  error: ErrorResponseType | null;
  /** @deprecated Use response?.message instead */
  statusMessage: TranslationKey | undefined;
}

export const useApiStore = create<ApiStore>((set, get) => ({
  queries: {},
  mutations: {},
  forms: {},
  customState: {},

  getQueryId: (queryKey: QueryKey): string => generateStorageKey(queryKey),

  getMutationId: (endpoint: {
    readonly method: Methods;
    readonly path: readonly string[];
    // eslint-disable-next-line i18next/no-literal-string
  }): string => `mutation-${endpoint.path.join("-")}-${endpoint.method}`,

  getFormId: (endpoint: {
    readonly method: Methods;
    readonly path: readonly string[];
    // eslint-disable-next-line i18next/no-literal-string
  }): string => `form-${endpoint.path.join("-")}-${endpoint.method}`,

  executeQuery: async <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["TRequestOutput"],
    pathParams: TEndpoint["TUrlVariablesOutput"],
    t: TFunction,
    locale: CountryLanguage,
    options: Omit<
      ApiQueryOptions<
        TEndpoint["TRequestOutput"],
        TEndpoint["TResponseOutput"],
        TEndpoint["TUrlVariablesOutput"]
      >,
      "queryKey"
    > & {
      queryKey?: QueryKey;
    } = {},
  ): Promise<ResponseType<TEndpoint["TResponseOutput"]>> => {
    // Check if the endpoint expects undefined for request data
    // This is determined by checking if the schema is undefinedSchema
    const isUndefinedSchema =
      endpoint.requestSchema.safeParse(undefined).success &&
      !endpoint.requestSchema.safeParse({}).success;

    // If the schema expects undefined but we received an object, set requestData to undefined
    if (
      isUndefinedSchema &&
      typeof requestData === "object" &&
      requestData !== null
    ) {
      requestData = undefined as TEndpoint["TRequestOutput"];
    }

    const queryId = get().getQueryId(
      options.queryKey ?? [endpoint.path.join("/"), endpoint.method],
    );
    // eslint-disable-next-line i18next/no-literal-string
    const requestKey = `${queryId}|${JSON.stringify(requestData)}|${JSON.stringify(pathParams)}`;

    // Clean up old in-flight requests
    cleanupInFlightRequests();

    // Check if we need to throttle this request
    const now = Date.now();
    const lastRequestTime = throttleMap.get(requestKey);
    if (lastRequestTime && now - lastRequestTime < THROTTLE_INTERVAL) {
      // If we've made this request recently, throttle it
      // Check if we already have a request in flight
      const existingRequestEntry = inFlightRequests.get(requestKey);
      if (existingRequestEntry) {
        // If we have a request in flight, return the existing request
        const result = await existingRequestEntry.promise;
        return createSuccessResponse(result as TEndpoint["TResponseOutput"]);
      }
    }

    // Update the throttle map
    throttleMap.set(requestKey, now);

    // Clean up the throttle map if it gets too large
    if (throttleMap.size > MAX_IN_FLIGHT_REQUESTS * 2) {
      // Keep only the most recent entries
      const entries = [...throttleMap.entries()];
      const sortedEntries = entries.toSorted((a, b) => b[1] - a[1]); // Sort by timestamp, newest first
      throttleMap.clear();
      for (const [key, timestamp] of sortedEntries.slice(
        0,
        MAX_IN_FLIGHT_REQUESTS,
      )) {
        throttleMap.set(key, timestamp);
      }
    }

    // Check if we already have a request in flight
    const existingRequestEntry = inFlightRequests.get(requestKey);
    if (existingRequestEntry && options.refreshDelay) {
      // If we have a request in flight and a refresh delay is set, return the existing request
      const result = await existingRequestEntry.promise;
      return createSuccessResponse(result as TEndpoint["TResponseOutput"]);
    }

    // Check if we have fresh data in the store
    const existingQuery = get().queries[queryId];
    const hasValidData = Boolean(existingQuery?.data && !existingQuery.isError);
    const isFresh =
      existingQuery?.lastFetchTime &&
      Date.now() - existingQuery.lastFetchTime < (options.staleTime ?? 60_000);

    // If we have fresh data and this isn't a forced refresh, just update the state minimally
    if (hasValidData && isFresh && !options.forceRefresh) {
      // Just mark as fetching without changing other state
      set((state) => {
        const queries = { ...state.queries };
        if (queries[queryId]) {
          queries[queryId] = {
            ...queries[queryId],
            isFetching: true,
          };
        }
        return { queries };
      });

      // Return the existing data wrapped in a promise
      const result = existingQuery.data as TEndpoint["TResponseOutput"];

      // Schedule a background refresh if needed
      if (options.backgroundRefresh) {
        // Define the window interface extension
        interface TimeoutMap {
          [key: string]: () => void;
        }

        interface CustomWindow extends Window {
          __nextVibeTimeouts?: TimeoutMap;
        }

        // eslint-disable-next-line i18next/no-literal-string
        const timeoutKey = `bg_refresh_${queryId}_${Date.now()}`;
        const refreshDelay = options.refreshDelay ?? 100;

        const timeoutId = setTimeout(() => {
          // Remove this timeout from tracking
          if (typeof window !== "undefined") {
            const customWindow = window as CustomWindow;
            if (customWindow.__nextVibeTimeouts) {
              delete customWindow.__nextVibeTimeouts[timeoutKey];
            }
          }

          void get().executeQuery(
            endpoint,
            logger,
            requestData,
            pathParams,
            t,
            locale,
            {
              ...options,
              forceRefresh: true,
              backgroundRefresh: false,
            },
          );
        }, refreshDelay);

        // Store the timeout ID so it can be cleaned up if needed
        if (typeof window !== "undefined") {
          const customWindow = window as CustomWindow;

          // Initialize the timeouts object if it doesn't exist
          customWindow.__nextVibeTimeouts ??= {};

          // Store the timeout ID with a cleanup function
          customWindow.__nextVibeTimeouts[timeoutKey] = (): void => {
            clearTimeout(timeoutId);
          };

          // Auto-cleanup after 30 seconds to prevent memory leaks
          setTimeout(() => {
            const win = window as CustomWindow;
            if (win.__nextVibeTimeouts?.[timeoutKey]) {
              // Call the cleanup function
              win.__nextVibeTimeouts[timeoutKey]();
              // Remove the entry
              delete win.__nextVibeTimeouts[timeoutKey];
            }
          }, 30_000);
        }
      }

      return createSuccessResponse(result);
    }

    // Set initial loading state
    set((state) => {
      const queries = { ...state.queries };
      const existingQuery = queries[queryId] as
        | QueryStoreType<TEndpoint["TResponseOutput"]>
        | undefined;
      const existingData = existingQuery?.data;
      const existingLastFetchTime = existingQuery?.lastFetchTime;

      queries[queryId] = {
        response: undefined,
        data: existingData as AnyData,
        error: null,
        isError: false,
        isSuccess: false,
        statusMessage:
          "app.api.v1.core.system.unifiedInterface.react.store.status.loading_data" as const,
        isCachedData: false,
        lastFetchTime: existingLastFetchTime ?? null,
        isLoading: true,
        isFetching: true,
        isLoadingFresh: !existingData,
      };

      return { queries };
    });

    // Deduplicate in-flight requests
    if (
      inFlightRequests.has(requestKey) &&
      options.deduplicateRequests !== false
    ) {
      try {
        const entry = inFlightRequests.get(requestKey);
        if (entry) {
          const result = await entry.promise;
          return createSuccessResponse(result as TEndpoint["TResponseOutput"]);
        }
      } catch (error) {
        // If the shared request fails, we'll continue and try again
        logger.error("Shared request failed, retrying", parseError(error));
        // Remove the failed request
        inFlightRequests.delete(requestKey);
      }
    }

    // Try to load from cache if enabled
    if (!options.disableLocalCache) {
      try {
        const cachedData =
          getStorageItem<TEndpoint["TResponseOutput"]>(queryId);
        if (cachedData) {
          set((state) => {
            const existingQuery = state.queries[queryId] ?? {};
            return {
              queries: {
                ...state.queries,
                [queryId]: {
                  ...existingQuery,
                  data: cachedData,
                  error: null,
                  isLoading: false,
                  isFetching: false,
                  isError: false,
                  isSuccess: true,
                  isLoadingFresh: false,
                  isCachedData: true,
                  statusMessage:
                    "app.api.v1.core.system.unifiedInterface.react.store.status.cached_data" as const,
                  lastFetchTime: existingQuery.lastFetchTime ?? null,
                },
              },
            };
          });

          // Return cached data immediately, but continue fetching fresh data
          // using proper background refresh with delay to prevent race conditions
          const refreshDelay = options.refreshDelay ?? 50; // 50ms default delay

          // Track all background refresh timeouts to prevent memory leaks

          // eslint-disable-next-line i18next/no-literal-string
          const timeoutKey = `bg_refresh_${queryId}_${Date.now()}`;

          // Define the window interface extension
          interface CustomWindow extends Window {
            __nextVibeTimeouts?: TimeoutMap;
          }

          // Use a simple timeout instead of creating a promise that might not be properly cleaned up
          const timeoutId = setTimeout(() => {
            // Remove this timeout from tracking
            if (typeof window !== "undefined") {
              const customWindow = window as CustomWindow;
              if (customWindow.__nextVibeTimeouts) {
                delete customWindow.__nextVibeTimeouts[timeoutKey];
              }
            }

            const { executeQuery } = get();
            executeQuery(endpoint, logger, requestData, pathParams, t, locale, {
              ...options,
              queryKey: options.queryKey as QueryKey,
              disableLocalCache: true,
              // Prevent infinite chain of background refreshes
              backgroundRefresh: false,
            }).catch((err) =>
              logger.error("Background refresh failed", parseError(err)),
            );
          }, refreshDelay);

          // Store the timeout ID so it can be cleaned up if needed
          if (typeof window !== "undefined") {
            const customWindow = window as CustomWindow;

            // Initialize the timeouts object if it doesn't exist
            customWindow.__nextVibeTimeouts ??= {};

            // Store the timeout ID with a cleanup function
            customWindow.__nextVibeTimeouts[timeoutKey] = (): void => {
              clearTimeout(timeoutId);
            };

            // Auto-cleanup after 30 seconds to prevent memory leaks
            setTimeout(() => {
              const win = window as CustomWindow;
              if (win.__nextVibeTimeouts?.[timeoutKey]) {
                // Call the cleanup function
                win.__nextVibeTimeouts[timeoutKey]();
                // Remove the entry
                delete win.__nextVibeTimeouts[timeoutKey];
              }
            }, 30_000);
          }

          return createSuccessResponse(cachedData);
        }
      } catch (error) {
        logger.debug("Failed to load data from storage:", parseError(error));
      }
    }

    // Create the fetch promise
    const fetchPromise = (async (): Promise<TEndpoint["TResponseOutput"]> => {
      // Validate request data using the endpoint's schema
      // Skip validation for z.never() schemas (GET endpoints with no request data)
      const requestSchema = endpoint.requestSchema as unknown as z.ZodTypeAny;
      const isNeverSchema = requestSchema instanceof z.ZodNever;

      if (!isNeverSchema) {
        const requestValidation = requestSchema.safeParse(requestData);

        if (!requestValidation.success) {
          logger.error("executeQuery: request validation failed", {
            endpointPath: endpoint.path.join("/"),
            error: requestValidation.error.message,
          });
          removeStorageItem(queryId);

          // Create a proper error response
          const errorResponse = fail({
            message:
              "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { endpoint: endpoint.path.join("/") },
          });

          // Update state with error
          set((state) => ({
            queries: {
              ...state.queries,
              [queryId]: {
                ...((state.queries[queryId] as
                  | QueryStoreType<AnyData>
                  | undefined) ?? {}),
                response: errorResponse,
                data: (
                  state.queries[queryId] as QueryStoreType<AnyData> | undefined
                )?.data,
                error: errorResponse,
                isLoading: false,
                isFetching: false,
                isError: true,
                isSuccess: false,
                isLoadingFresh: false,
                isCachedData: state.queries[queryId]?.isCachedData ?? false,
                statusMessage:
                  "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed" as const,
                lastFetchTime: Date.now(),
              },
            },
          }));

          // Call onError callback if provided
          if (options.onError) {
            options.onError({
              error: errorResponse,
              requestData,
              urlPathParams: pathParams,
            });
          }

          // Return undefined since we can't throw - the error is already handled in state
          return undefined as TEndpoint["TResponseOutput"];
        }
      }

      try {
        // Build the endpoint URL with locale
        const endpointUrl = `/api/${locale}/${endpoint.path.join("/")}`;

        // Prepare the request body for non-GET requests
        // Check if requestData contains File objects - if so, use FormData
        let postBody: string | FormData | undefined;
        if (endpoint.method !== Methods.GET) {
          if (containsFile(requestData)) {
            // Convert to FormData
            // eslint-disable-next-line no-restricted-syntax
            postBody = objectToFormData(requestData as Record<string, unknown>);
          } else {
            // Use JSON
            postBody = JSON.stringify(requestData);
          }
        }

        const response = await callApi(
          endpoint as never,
          endpointUrl,
          postBody,
          logger,
        );

        if (!response.success) {
          removeStorageItem(queryId);

          // Update state with error from API
          set((state) => {
            const existingQuery = state.queries[queryId];
            return {
              queries: {
                ...state.queries,
                [queryId]: {
                  ...(existingQuery ?? {}),
                  response: response as ResponseType<AnyData>,
                  data: existingQuery?.data,
                  error: response,
                  isLoading: false,
                  isFetching: false,
                  isError: true,
                  isSuccess: false,
                  statusMessage:
                    "app.api.v1.core.system.unifiedInterface.react.store.errors.request_failed" as const,
                  isLoadingFresh: false,
                  isCachedData: existingQuery?.isCachedData ?? false,
                  lastFetchTime: Date.now(),
                },
              },
            };
          });

          // Call onError callback if provided
          if (options.onError) {
            options.onError({
              error: response,
              requestData,
              urlPathParams: pathParams,
            });
          }

          // Return undefined since we can't throw - the error is already handled in state
          return undefined as TEndpoint["TResponseOutput"];
        }

        // Cache successful response if caching is enabled
        if (!options.disableLocalCache) {
          void setStorageItem(queryId, response.data);
        }

        // Update state with successful result
        set((state) => {
          const newState = {
            queries: {
              ...state.queries,
              [queryId]: {
                response: response as ResponseType<AnyData>,
                data: (response.success ? response.data : undefined) as AnyData,
                error: null,
                isLoading: false,
                isFetching: false,
                isError: false,
                isSuccess: true,
                isLoadingFresh: false,
                isCachedData: false,
                statusMessage:
                  "app.api.v1.core.system.unifiedInterface.react.store.status.success" as const,
                lastFetchTime: Date.now(),
              },
            },
          };

          logger.debug("executeQuery: SUCCESS - Store updated", {
            queryId,
            endpointPath: endpoint.path.join("/"),
            hasData: !!response.data,
            responseData:
              response.data !== undefined
                ? JSON.stringify(response.data)
                : undefined,
          });

          return newState;
        });

        // Call onSuccess callback if provided
        if (options.onSuccess) {
          const onSuccessResult = options.onSuccess({
            requestData,
            urlPathParams: pathParams,
            responseData: (response.success
              ? response.data
              : undefined) as TEndpoint["TResponseOutput"],
          });

          // If onSuccess returns an error, treat it as an error
          if (onSuccessResult) {
            // Update state to error
            set((state) => ({
              queries: {
                ...state.queries,
                [queryId]: {
                  ...((state.queries[queryId] as
                    | QueryStoreType<AnyData>
                    | undefined) ?? {}),
                  response: onSuccessResult as ResponseType<AnyData>,
                  data: (
                    state.queries[queryId] as
                    | QueryStoreType<AnyData>
                    | undefined
                  )?.data,
                  error: onSuccessResult,
                  isLoading: false,
                  isFetching: false,
                  isError: true,
                  isSuccess: false,
                  isLoadingFresh: false,
                  isCachedData: state.queries[queryId]?.isCachedData ?? false,
                  statusMessage:
                    "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed" as const,
                  lastFetchTime: Date.now(),
                },
              },
            }));

            // Call onError callback if provided
            if (options.onError) {
              options.onError({
                error: onSuccessResult,
                requestData,
                urlPathParams: pathParams,
              });
            }

            // Return undefined since we can't throw - the error is already handled in state
            return undefined as TEndpoint["TResponseOutput"];
          }
        }

        return (
          response.success ? response.data : undefined
        ) as TEndpoint["TResponseOutput"];
      } catch (err) {
        // Create a properly typed error response with translation key
        const errorResponse = fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.store.errors.request_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: parseError(err).message,
            endpoint: endpoint.path.join("/"),
          },
        });

        // Update state with error
        set((state) => ({
          queries: {
            ...state.queries,
            [queryId]: {
              ...((state.queries[queryId] as
                | QueryStoreType<AnyData>
                | undefined) ?? {}),
              response: errorResponse as ResponseType<AnyData>,
              data: (
                state.queries[queryId] as QueryStoreType<AnyData> | undefined
              )?.data,
              error: errorResponse,
              isLoading: false,
              isFetching: false,
              isError: true,
              isSuccess: false,
              isLoadingFresh: false,
              isCachedData: state.queries[queryId]?.isCachedData ?? false,
              statusMessage:
                "app.api.v1.core.system.unifiedInterface.react.store.errors.request_failed" as const,
              lastFetchTime: Date.now(),
            },
          },
        }));

        // Call onError callback if provided
        if (options.onError) {
          options.onError({
            error: errorResponse,
            requestData,
            urlPathParams: pathParams,
          });
        }

        // Return undefined since we can't throw - the error is already handled in state
        return undefined as TEndpoint["TResponseOutput"];
      }
    })();

    // Register the in-flight request with timestamp
    inFlightRequests.set(requestKey, {
      promise: fetchPromise as Promise<AnyData>,
      timestamp: Date.now(),
    });

    // Set up cleanup when the promise resolves or rejects
    void fetchPromise.finally(() => {
      // Remove the in-flight request when done
      inFlightRequests.delete(requestKey);
    });

    try {
      const result = await fetchPromise;

      return createSuccessResponse(result);
    } catch (error) {
      logger.error("executeQuery: Error in await fetchPromise", {
        endpointPath: endpoint.path.join("/"),
        error: parseError(error),
      });
      // Return error response instead of throwing
      const errorResponse = isErrorResponseType(error)
        ? error
        : fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.store.errors.request_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: parseError(error).message },
        });
      return errorResponse;
    }
  },

  executeMutation: async <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["TRequestOutput"],
    pathParams: TEndpoint["TUrlVariablesOutput"],
    t: TFunction,
    locale: CountryLanguage,
    options: ApiMutationOptions<
      TEndpoint["TRequestOutput"],
      TEndpoint["TResponseOutput"],
      TEndpoint["TUrlVariablesOutput"]
    > = {},
  ): Promise<ResponseType<TEndpoint["TResponseOutput"]>> => {
    // Check if the endpoint expects undefined for request data
    // This is determined by checking if the schema is undefinedSchema
    const isUndefinedSchema =
      endpoint.requestSchema.safeParse(undefined).success &&
      !endpoint.requestSchema.safeParse({}).success;

    // If the schema expects undefined but we received an object, set requestData to undefined
    if (
      isUndefinedSchema &&
      typeof requestData === "object" &&
      requestData !== null
    ) {
      logger.debug(
        "Converting object to undefined for endpoint with undefinedSchema",
        endpoint.path.join("/"),
      );
      requestData = undefined as TEndpoint["TRequestOutput"];
    }
    const mutationId = get().getMutationId(endpoint);

    // Set initial state
    set((state) => ({
      mutations: {
        ...state.mutations,
        [mutationId]: {
          response: undefined,
          isPending: true,
          isError: false,
          error: null,
          isSuccess: false,
          statusMessage:
            "app.api.v1.core.system.unifiedInterface.react.store.status.mutation_pending" as const,
          data: undefined,
        },
      },
    }));

    try {
      // Validate request data using the endpoint's schema
      const requestValidation = endpoint.requestSchema.safeParse(requestData);

      if (!requestValidation.success) {
        // Create a proper error response
        const errorResponse = fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { endpoint: endpoint.path.join("/") },
        });

        // Update error state
        set((state) => ({
          mutations: {
            ...state.mutations,
            [mutationId]: {
              response: errorResponse as ResponseType<AnyData>,
              isPending: false,
              isError: true,
              error: errorResponse,
              isSuccess: false,
              statusMessage:
                "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed" as const,
              data: undefined,
            },
          },
        }));

        // Call onError handler if provided
        if (options.onError) {
          await options.onError({
            pathParams,
            requestData,
            error: errorResponse,
          });
        }

        return errorResponse;
      }

      // Build the endpoint URL with locale
      const endpointUrl = `/api/${locale}/${endpoint.path.join("/")}`;

      // Prepare the request body for non-GET requests
      // Check if requestData contains File objects - if so, use FormData
      let postBody: string | FormData | undefined;
      if (endpoint.method !== Methods.GET) {
        if (containsFile(requestData)) {
          // Convert to FormData
          // eslint-disable-next-line no-restricted-syntax
          postBody = objectToFormData(requestData as Record<string, unknown>);
        } else {
          // Use JSON
          postBody = JSON.stringify(requestData);
        }
      }

      const response = await callApi(endpoint, endpointUrl, postBody, logger);

      if (!response.success) {
        // Update error state
        set((state) => ({
          mutations: {
            ...state.mutations,
            [mutationId]: {
              response: response as ResponseType<AnyData>,
              isPending: false,
              isError: true,
              error: response,
              isSuccess: false,
              statusMessage:
                "app.api.v1.core.system.unifiedInterface.react.store.errors.mutation_failed" as const,
              data: undefined,
            },
          },
        }));

        // Call onError handler if provided
        if (options.onError) {
          await options.onError({
            pathParams,
            requestData,
            error: response,
          });
        }

        // Return error response with proper translation key
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.store.errors.mutation_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: response.message,
            endpoint: endpoint.path.join("/"),
          },
        });
      }

      // Update success state
      const responseData = (
        response.success ? response.data : undefined
      ) as TEndpoint["TResponseOutput"];
      const successResponse = createSuccessResponse(responseData);
      set((state) => ({
        mutations: {
          ...state.mutations,
          [mutationId]: {
            response: successResponse as ResponseType<AnyData>,
            isPending: false,
            isError: false,
            error: null,
            isSuccess: true,
            statusMessage:
              "app.api.v1.core.system.unifiedInterface.react.store.status.mutation_success" as const,
            data: responseData as AnyData,
          },
        },
      }));

      // Invalidate queries (trigger refetch)
      if (options.invalidateQueries) {
        await get().invalidateQueries(options.invalidateQueries);
      }

      // Call onSuccess handler if provided
      if (options.onSuccess) {
        const onSuccessResult = await options.onSuccess({
          responseData,
          pathParams,
          requestData,
        });

        // If onSuccess returns an error, treat it as an error
        if (onSuccessResult) {
          // Update state to error
          set((state) => ({
            mutations: {
              ...state.mutations,
              [mutationId]: {
                response: onSuccessResult as ResponseType<AnyData>,
                isPending: false,
                isError: true,
                error: onSuccessResult,
                isSuccess: false,
                statusMessage:
                  "app.api.v1.core.system.unifiedInterface.react.store.errors.validation_failed" as const,
                data: undefined,
              },
            },
          }));

          // Call onError handler if provided
          if (options.onError) {
            await options.onError({
              pathParams,
              requestData,
              error: onSuccessResult,
            });
          }

          return onSuccessResult;
        }
      }

      return createSuccessResponse(responseData);
    } catch (error) {
      // If the error is already an ErrorResponseType, use it directly
      const errorResponse = isErrorResponseType(error)
        ? error
        : fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.store.errors.mutation_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: parseError(error).message },
        });

      // Update error state
      set((state) => ({
        mutations: {
          ...state.mutations,
          [mutationId]: {
            response: errorResponse as ResponseType<AnyData>,
            isPending: false,
            isError: true,
            error: errorResponse,
            isSuccess: false,
            statusMessage:
              "app.api.v1.core.system.unifiedInterface.react.store.errors.unexpected_failure" as const,
            data: undefined,
          },
        },
      }));

      // Call onError handler if provided
      if (options.onError) {
        await options.onError({
          pathParams,
          requestData,
          error: errorResponse,
        });
      }

      // Return error response with proper translation key
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.react.store.errors.unexpected_failure",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: errorResponse.message,
          endpoint: endpoint.path.join("/"),
        },
      });
    }
  },

  invalidateQueries: async (queryKey: QueryKey): Promise<void> => {
    const queryId = get().getQueryId(queryKey);

    // Remove from storage
    removeStorageItem(queryId);

    // Clear from in-memory state to force refetch on next access
    set((state) => {
      const queries = { ...state.queries };
      if (queries[queryId]) {
        // Mark as stale instead of completely removing
        queries[queryId] = {
          ...queries[queryId],
          isCachedData: true,
        };
      }
      return { queries };
    });

    // Also invalidate in React Query if it's being used
    await queryClient.invalidateQueries({ queryKey });
  },

  refetchQuery: async <TResponse>(
    queryKey: QueryKey,
  ): Promise<ResponseType<TResponse | undefined>> => {
    const queryId = get().getQueryId(queryKey);
    const query = get().queries[queryId];

    if (!query) {
      return createSuccessResponse(undefined);
    }

    // We'd need the original parameters to refetch properly
    // This is a limitation of the current implementation
    // In a complete solution, we'd store the original parameters with the query

    try {
      // For now, just invalidate to force a refetch on next access
      await get().invalidateQueries(queryKey);
      return createSuccessResponse(query.data as TResponse | undefined);
    } catch (err) {
      // Create a proper error response with error details and translation key
      const errorMessage = err instanceof Error ? err.message : String(err);
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.react.store.errors.refetch_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: errorMessage,
          queryKey: JSON.stringify(queryKey),
        },
      });
    }
  },

  setFormError: (formId: string, error: ErrorResponseType | null): void => {
    set((state) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...(state.forms[formId] ?? { isSubmitting: false }),
          formError: error,
        },
      },
    }));
  },

  clearFormError: (formId: string): void => {
    set((state) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...(state.forms[formId] ?? { formError: null, isSubmitting: false }),
          formError: null,
        },
      },
    }));
  },

  setFormQueryParams: (formId: string, params: FormQueryParams): void => {
    set((state) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...(state.forms[formId] ?? { formError: null, isSubmitting: false }),
          queryParams: params,
        },
      },
    }));
  },

  getFormQueryParams: <T>(formId: string): T | undefined => {
    const form = get().forms[formId];
    return form?.queryParams as T | undefined;
  },

  /**
   * Update query data for an endpoint
   * This is useful for optimistic updates or updating cache after mutations/streams
   */
  updateEndpointData: <
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >,
  >(
    endpoint: TEndpoint,
    updater: (
      oldData:
        | {
          success: boolean;
          data: TEndpoint["TResponseOutput"];
        }
        | undefined,
    ) =>
      | {
        success: boolean;
        data: TEndpoint["TResponseOutput"];
      }
      | undefined,
    requestData?: TEndpoint["TRequestOutput"],
    urlPathParams?: TEndpoint["TUrlVariablesOutput"],
  ): void => {
    // Generate the query key in the same format as useApiQuery
    const endpointKey = `${endpoint.path.join("/")}:${endpoint.method}`;

    // Stringify request data
    // eslint-disable-next-line i18next/no-literal-string
    let requestDataKey = "{}";
    if (requestData !== undefined && requestData !== null) {
      try {
        requestDataKey = JSON.stringify(requestData);
      } catch {
        requestDataKey =
          typeof requestData === "object"
            ? Object.keys(requestData).toSorted().join(",")
            : String(requestData);
      }
    }

    // Stringify URL params
    // eslint-disable-next-line i18next/no-literal-string
    let urlPathParamsKey = "{}";
    if (urlPathParams !== undefined && urlPathParams !== null) {
      try {
        urlPathParamsKey = JSON.stringify(urlPathParams);
      } catch {
        urlPathParamsKey =
          typeof urlPathParams === "object"
            ? Object.keys(urlPathParams).toSorted().join(",")
            : String(urlPathParams);
      }
    }

    const queryKey: QueryKey = [endpointKey, requestDataKey, urlPathParamsKey];
    const queryId = get().getQueryId(queryKey);

    // Update the query data in the store
    set((state) => {
      const queries = { ...state.queries };
      const existingQuery = queries[queryId];

      if (!existingQuery) {
        // Query doesn't exist yet, can't update
        return state;
      }

      // Apply the updater function
      // Use response field (not deprecated data field) to get the full ResponseType
      const oldData = existingQuery.response as
        | {
          success: boolean;
          data: TEndpoint["TResponseOutput"];
        }
        | undefined;

      const newData = updater(oldData);

      if (newData === undefined) {
        // Updater returned undefined, don't update
        return state;
      }

      // Create a new query object to ensure reference changes
      queries[queryId] = {
        ...existingQuery,
        response: newData as ResponseType<AnyData>,
        data: newData.data as AnyData,
        // Update timestamp to ensure change detection
        lastFetchTime: Date.now(),
      };

      return { queries };
    });
  },
}));

// Export QueryClient for potential direct usage
export { queryClient };

/**
 * Non-hook version for fetching data outside of React components
 * Use this in regular functions instead of useApiQuery
 */
export const apiClient = {
  /**
   * Fetch data from an API endpoint without using React hooks
   */
  fetch: async <
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TRequestOutput,
    pathParams: TUrlVariablesOutput,
    t: TFunction,
    locale: CountryLanguage,
    options: Omit<
      ApiQueryOptions<TRequestOutput, TResponseOutput, TUrlVariablesOutput>,
      "queryKey"
    > & {
      queryKey?: QueryKey;
    } = {},
  ): Promise<ResponseType<TResponseOutput>> => {
    // Check if the endpoint expects undefined for request data
    const requestSchema = endpoint.requestSchema as unknown as z.ZodTypeAny;
    const isUndefinedSchema =
      requestSchema.safeParse(undefined).success &&
      !requestSchema.safeParse({}).success;

    // If the schema expects undefined but we received an object, set requestData to undefined
    if (
      isUndefinedSchema &&
      typeof requestData === "object" &&
      requestData !== null
    ) {
      logger.debug(
        "Converting object to undefined for endpoint with undefinedSchema",
        endpoint.path.join("/"),
      );
      requestData = undefined as TEndpoint["TRequestOutput"];
    }

    const response = await useApiStore
      .getState()
      .executeQuery(
        endpoint,
        logger,
        requestData,
        pathParams,
        t,
        locale,
        options,
      );

    if (!response.success) {
      // Log the error
      logger.error("API query failed", {
        endpoint: endpoint.path.join("/"),
        error: response.message,
      });

      // Return the error response directly
      return response;
    }

    // Return the success response directly
    return response;
  },

  /**
   * Mutate data through an API endpoint without using React hooks
   */
  mutate: async <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    data: TEndpoint["TRequestOutput"],
    pathParams: TEndpoint["TUrlVariablesOutput"],
    t: TFunction,
    locale: CountryLanguage,
    options: ApiMutationOptions<
      TEndpoint["TRequestOutput"],
      TEndpoint["TResponseOutput"],
      TEndpoint["TUrlVariablesOutput"]
    > = {},
  ): Promise<ResponseType<TEndpoint["TResponseOutput"]>> => {
    // Check if the endpoint expects undefined for request data
    const isUndefinedSchema =
      endpoint.requestSchema.safeParse(undefined).success &&
      !endpoint.requestSchema.safeParse({}).success;

    // If the schema expects undefined but we received an object, set data to undefined
    if (isUndefinedSchema && typeof data === "object" && data !== null) {
      logger.debug(
        "Converting object to undefined for endpoint with undefinedSchema",
        endpoint.path.join("/"),
      );
      data = undefined as TEndpoint["TRequestOutput"];
    }

    const response = await useApiStore
      .getState()
      .executeMutation(endpoint, logger, data, pathParams, t, locale, options);

    if (!response.success) {
      // Log the error
      logger.error("API mutation failed", {
        endpoint: endpoint.path.join("/"),
        error: response.message,
      });

      // Return the error response directly
      return response;
    }

    // Return the success response directly
    return response;
  },

  /**
   * Invalidate a query to force refetch on next access
   */
  invalidateQueries: async (queryKey: QueryKey): Promise<void> => {
    await useApiStore.getState().invalidateQueries(queryKey);
  },

  /**
   * Get current query state without using React hooks
   */
  getQueryState: <TResponse>(
    queryKey: QueryKey,
  ): QueryStoreType<TResponse> | undefined => {
    const queryId = useApiStore.getState().getQueryId(queryKey);
    const state = useApiStore.getState();
    const query = state.queries[queryId];
    return query as QueryStoreType<TResponse> | undefined;
  },

  /**
   * Get current mutation state without using React hooks
   */
  getMutationState: <
    TUserRoleValue extends readonly (typeof UserRoleValue)[],
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      TUserRoleValue,
      unknown
    >,
  >(
    endpoint: TEndpoint,
  ): MutationStoreType<TEndpoint["TResponseOutput"]> | undefined => {
    const mutationId = useApiStore.getState().getMutationId(endpoint);
    const state = useApiStore.getState();
    const mutation = state.mutations[mutationId];
    return mutation as
      | MutationStoreType<TEndpoint["TResponseOutput"]>
      | undefined;
  },

  /**
   * Update query data for an endpoint
   * This is useful for optimistic updates or updating cache after mutations/streams
   *
   * @param endpoint - The endpoint definition (GET endpoint)
   * @param updater - Function that receives the old data and returns the new data
   * @param requestData - Optional request data (query params)
   * @param urlPathParams - Optional URL parameters
   *
   * @example
   * // Update credit balance after AI response completes
   * apiClient.updateEndpointData(
   *   creditsDefinition.GET,
   *   (oldData) => {
   *     if (!oldData?.data) return oldData;
   *     return {
   *       ...oldData,
   *       data: {
   *         ...oldData.data,
   *         total: oldData.data.total - creditCost,
   *       });
   *     };
   *   }
   * );
   */
  updateEndpointData: <
    TEndpoint extends CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >,
  >(
    endpoint: TEndpoint,
    updater: (
      oldData:
        | {
          success: boolean;
          data: TEndpoint["TResponseOutput"];
        }
        | undefined,
    ) =>
      | {
        success: boolean;
        data: TEndpoint["TResponseOutput"];
      }
      | undefined,
    requestData?: TEndpoint["TRequestOutput"],
    urlPathParams?: TEndpoint["TUrlVariablesOutput"],
  ): void => {
    useApiStore
      .getState()
      .updateEndpointData(endpoint, updater, requestData, urlPathParams);
  },
};
