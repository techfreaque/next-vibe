import type { QueryKey } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { z } from "zod";
import { create } from "zustand";

import { generateStorageKey } from "@/app/api/[locale]/system/unified-interface/react/utils/storage-storage-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint";
import { executeQuery } from "./query-executor";
import { buildQueryKey } from "./query-key-builder";
import type { ApiMutationOptions, ApiQueryOptions } from "./types";

// Create a single QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export type AnyData =
  | Record<string, never>
  | Record<string, string | number | boolean | null | undefined>
  | string
  | number
  | boolean
  | null
  | undefined;

type CustomStateValue = string | number | boolean | null | undefined;

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
/**
 * Zustand store for forms and custom state only
 * Queries and mutations are now handled by React Query
 */
export interface ApiStore {
  // Form state
  forms: FormStoreMap;

  // Custom state
  customState: CustomStateMap;

  // Form-related methods
  setFormError: (formId: string, error: ErrorResponseType | null) => void;
  clearFormError: (formId: string) => void;
  setFormQueryParams: (formId: string, params: FormQueryParams) => void;
  getFormQueryParams: <T>(formId: string) => T | undefined;

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

  // React Query integration methods
  invalidateQueries: (queryKey: QueryKey) => Promise<void>;
  refetchQuery: <TResponse>(
    queryKey: QueryKey,
  ) => Promise<ResponseType<TResponse | undefined>>;

  /**
   * Refetch endpoint queries by invalidating all queries for this endpoint
   * This will cause all matching queries to refetch with their stored parameters
   */
  refetchEndpoint: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
  ) => Promise<void>;

  /**
   * Update endpoint data in React Query cache (for optimistic updates)
   * This is the ONLY way to update query data - no Zustand involved
   */
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData:
        | {
            success: boolean;
            data: TEndpoint["types"]["ResponseOutput"];
          }
        | undefined,
    ) =>
      | {
          success: boolean;
          data: TEndpoint["types"]["ResponseOutput"];
        }
      | undefined,
    requestData?: TEndpoint["types"]["RequestOutput"],
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"],
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
  // Only forms and custom state remain in Zustand
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

  // executeQuery and executeMutation have been removed
  // They are now standalone functions: query-executor.ts and mutation-executor.ts (to be created)
  // Use useApiQuery and useApiMutation hooks instead

  invalidateQueries: async (queryKey: QueryKey): Promise<void> => {
    // Invalidate in React Query
    await queryClient.invalidateQueries({ queryKey });
  },

  refetchQuery: async <TResponse>(
    queryKey: QueryKey,
  ): Promise<ResponseType<TResponse | undefined>> => {
    // Refetch using React Query
    await queryClient.refetchQueries({ queryKey });

    // Get the updated data from React Query cache
    const data = queryClient.getQueryData<ResponseType<TResponse>>(queryKey);
    return data ?? success(undefined);
  },

  refetchEndpoint: async <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
  ): Promise<void> => {
    // Build the endpoint key prefix
    const endpointKeyPrefix = `query-${endpoint.path.join("-")}-${endpoint.method}`;

    logger.debug("Invalidating endpoint queries", { endpointKeyPrefix });

    // Get all queries from cache that match this endpoint
    const matchingQueries = queryClient.getQueryCache().findAll({
      predicate: (query) => query.queryKey[0] === endpointKeyPrefix,
    });

    logger.debug("Found queries to invalidate", {
      count: matchingQueries.length,
    });

    // Invalidate each query using its exact stored queryKey
    // The queryKey contains [endpointKey, requestDataKey, urlPathParamsKey]
    // where requestDataKey and urlPathParamsKey are JSON stringified
    for (const query of matchingQueries) {
      await queryClient.invalidateQueries({ queryKey: query.queryKey });
    }
  },

  // Form-related methods
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
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData:
        | {
            success: boolean;
            data: TEndpoint["types"]["ResponseOutput"];
          }
        | undefined,
    ) =>
      | {
          success: boolean;
          data: TEndpoint["types"]["ResponseOutput"];
        }
      | undefined,
    requestData?: TEndpoint["types"]["RequestOutput"],
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"],
  ): void => {
    // Generate the query key using shared utility (same format as useApiQuery)
    const queryKey = buildQueryKey(
      endpoint,
      logger,
      requestData,
      urlPathParams,
    );

    // Update React Query cache (single source of truth)
    type CachedData =
      | {
          success: boolean;
          data: TEndpoint["types"]["ResponseOutput"];
        }
      | undefined;

    queryClient.setQueryData(queryKey, (oldData: CachedData) => {
      return updater(oldData);
    });
  },
}));

/**
 * Helper to deserialize query params that were serialized when stored
 * This parses JSON strings back to objects for nested data structures
 */
export function deserializeQueryParams<T>(
  params: FormQueryParams | undefined,
): T {
  if (!params) {
    return {} as T;
  }

  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Storage deserialization requires generic type handling
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      // Try to parse as JSON (for nested objects that were stringified)
      if (
        (value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]"))
      ) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          // Not valid JSON, keep as string
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Non-hook version for fetching data outside of React components
 * Use this in regular functions instead of useApiQuery
 */
export const apiClient = {
  /**
   * Fetch data from an API endpoint without using React hooks
   */
  fetch: async <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["types"]["RequestOutput"] extends never
      ? undefined
      : TEndpoint["types"]["RequestOutput"],
    pathParams: TEndpoint["types"]["UrlVariablesOutput"] extends never
      ? undefined
      : TEndpoint["types"]["UrlVariablesOutput"],
    locale: CountryLanguage,
    options: Omit<
      ApiQueryOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["ResponseOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      >,
      "queryKey"
    > & {
      queryKey?: QueryKey;
    } = {},
  ): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> => {
    // Check if the endpoint expects undefined for request data
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Schema type cast requires 'unknown' for runtime type compatibility
    const requestSchema = endpoint.requestSchema as unknown as z.ZodTypeAny;
    const isUndefinedSchema =
      requestSchema.safeParse(undefined).success &&
      !requestSchema.safeParse({}).success;

    // Check if the endpoint expects an empty object for request data (GET endpoints with no params)
    const isEmptyObjectSchema =
      requestSchema instanceof z.ZodObject &&
      Object.keys(requestSchema.shape).length === 0;

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
      requestData = undefined as TEndpoint["types"]["RequestOutput"];
    }

    // If the schema expects an empty object but we received undefined, set requestData to empty object
    if (isEmptyObjectSchema && requestData === undefined) {
      logger.debug(
        "Converting undefined to empty object for endpoint with empty object schema",
        endpoint.path.join("/"),
      );
      requestData = {} as TEndpoint["types"]["RequestOutput"];
    }

    // Use the query executor directly
    const response = await executeQuery({
      endpoint: endpoint as never,
      logger,
      requestData: requestData as never,
      pathParams: pathParams as never,
      locale,
      options: {
        onSuccess: options.onSuccess,
        onError: options.onError,
      },
    });

    return response;
  },

  /**
   * Mutate data through an API endpoint without using React hooks
   */
  mutate: async <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    requestData: TEndpoint["types"]["RequestOutput"],
    pathParams: TEndpoint["types"]["UrlVariablesOutput"],
    locale: CountryLanguage,
    options: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    > = {},
  ): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> => {
    const { executeMutation } = await import("./mutation-executor");

    return executeMutation({
      endpoint: endpoint as never,
      logger,
      requestData: requestData as never,
      pathParams: pathParams as never,
      locale,
      options: {
        onSuccess: options.onSuccess
          ? (context) =>
              options.onSuccess?.({
                requestData: context.requestData,
                pathParams: context.urlPathParams,
                responseData: context.responseData,
              })
          : undefined,
        onError: options.onError
          ? (context) =>
              options.onError?.({
                error: context.error,
                requestData: context.requestData,
                pathParams: context.urlPathParams,
              })
          : undefined,
      },
    });
  },

  /**
   * Invalidate a query to force refetch on next access
   */
  invalidateQueries: async (queryKey: QueryKey): Promise<void> => {
    await useApiStore.getState().invalidateQueries(queryKey);
  },

  /**
   * Refetch endpoint queries by invalidating all queries for this endpoint
   *
   * @example
   * await apiClient.refetchEndpoint(creditsDefinition.GET, logger);
   */
  refetchEndpoint: async <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
  ): Promise<void> => {
    return useApiStore.getState().refetchEndpoint(endpoint, logger);
  },

  /**
   * Get current query state from React Query cache
   */
  getQueryState: <TResponse>(
    queryKey: QueryKey,
  ): QueryStoreType<TResponse> | undefined => {
    // Get data from React Query cache
    const data = queryClient.getQueryData<ResponseType<TResponse>>(queryKey);

    if (!data) {
      return undefined;
    }

    // Map to QueryStoreType for backward compatibility
    return {
      response: data,
      data: data.success ? data.data : undefined,
      error: data.success ? null : data,
      isError: !data.success,
      isSuccess: data.success,
      isLoading: false,
      isFetching: false,
      isLoadingFresh: false,
      isCachedData: true,
      statusMessage: data.message,
      lastFetchTime: Date.now(),
    } as QueryStoreType<TResponse>;
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
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData:
        | {
            success: boolean;
            data: TEndpoint["types"]["ResponseOutput"];
          }
        | undefined,
    ) =>
      | {
          success: boolean;
          data: TEndpoint["types"]["ResponseOutput"];
        }
      | undefined,
    requestData?: TEndpoint["types"]["RequestOutput"],
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"],
  ): void => {
    useApiStore
      .getState()
      .updateEndpointData(
        endpoint,
        logger,
        updater,
        requestData,
        urlPathParams,
      );
  },
};
