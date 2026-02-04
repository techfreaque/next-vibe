import type { QueryKey } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";
import { create } from "zustand";

import { generateStorageKey } from "@/app/api/[locale]/system/unified-interface/react/utils/storage-storage-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { executeQuery } from "./query-executor";
import { buildKey } from "./query-key-builder";
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

  /**
   * Update cached endpoint data optimistically
   *
   * @param endpoint - The endpoint definition
   * @param logger - Logger for debugging
   * @param updater - Function to update the cached data
   * @param urlPathParams - URL path parameters (undefined if endpoint has none)
   */
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    ) => ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] | undefined,
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
   * Update cached endpoint data optimistically
   *
   * Cache key: endpoint.path + endpoint.method + urlPathParams
   * Multiple useEndpoint calls with same urlPathParams share the same cache.
   *
   * @param endpoint - The endpoint definition
   * @param logger - Logger for debugging
   * @param updater - Function to update the cached data
   * @param urlPathParams - URL path parameters (undefined if endpoint has none)
   *
   * @example
   * store.updateEndpointData(
   *   creditsDefinition.GET,
   *   logger,
   *   (oldData) => ({ ...oldData, data: { ...oldData.data, total: newTotal } }),
   *   undefined
   * );
   */
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    ) => ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] | undefined,
  ): void => {
    // buildKey returns string, wrap in array for React Query
    const builtKey = buildKey("query", endpoint, urlPathParams, logger);
    const stateKey = [builtKey];

    queryClient.setQueryData(
      stateKey,
      (
        oldData: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
      ) => {
        return updater(oldData);
      },
    );
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
    user: JwtPayloadType,
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
      user,
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
    user: JwtPayloadType,
    requestData: TEndpoint["types"]["RequestOutput"] extends never
      ? undefined
      : TEndpoint["types"]["RequestOutput"],
    pathParams: TEndpoint["types"]["UrlVariablesOutput"] extends never
      ? undefined
      : TEndpoint["types"]["UrlVariablesOutput"],
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
      user,
      options: {
        onSuccess: options.onSuccess
          ? (context) =>
              options.onSuccess?.({
                requestData: context.requestData,
                pathParams: context.urlPathParams,
                responseData: context.responseData,
                logger: context.logger,
              })
          : undefined,
        onError: options.onError
          ? (context) =>
              options.onError?.({
                error: context.error,
                requestData: context.requestData,
                pathParams: context.urlPathParams,
                logger: context.logger,
              })
          : undefined,
      },
    });
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
    ...args: TEndpoint["types"]["UrlVariablesOutput"] extends undefined
      ? []
      : [urlPathParams: TEndpoint["types"]["UrlVariablesOutput"]]
  ): Promise<void> => {
    const urlPathParams = args[0];
    const builtKey = buildKey("query", endpoint, urlPathParams, logger);
    const queryKey = [builtKey];
    await queryClient.invalidateQueries({ queryKey });
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
   * Update cached endpoint data optimistically
   *
   * Cache key: endpoint.path + endpoint.method + urlPathParams
   *
   * @param endpoint - The endpoint definition
   * @param logger - Logger for debugging
   * @param updater - Function to update the cached data
   * @param urlPathParams - URL path parameters (undefined if endpoint has none)
   *
   * @example
   * apiClient.updateEndpointData(
   *   creditsDefinition.GET,
   *   logger,
   *   (oldData) => ({
   *     ...oldData,
   *     data: { ...oldData.data, total: oldData.data.total - creditCost }
   *   }),
   *   undefined
   * );
   */
  updateEndpointData: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    logger: EndpointLogger,
    updater: (
      oldData: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    ) => ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined,
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] | undefined,
  ): void => {
    useApiStore
      .getState()
      .updateEndpointData(endpoint, logger, updater, urlPathParams);
  },
};
