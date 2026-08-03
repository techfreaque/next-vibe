import type {
  DefaultError,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { TranslatedKeyType } from "../../core/i18n/core/scoped-translation";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";

/**
 * Utility types to extract types from CreateApiEndpoint definitions
 * These allow hooks to infer return types from endpoint definitions
 */

/**
 * Enhanced query result with additional loading state info
 */
export interface ApiQueryReturn<TResponse> {
  /** The complete response including success/error state */
  response: ResponseType<TResponse> | undefined;

  // Computed properties for backward compatibility
  /** @deprecated Use response.success and response.data instead */
  data: TResponse | undefined;
  /** @deprecated Use response.success === false ? response : undefined instead */
  error: ErrorResponseType | undefined;
  /** @deprecated Use !response?.success instead */
  isError: boolean;
  /** @deprecated Use response?.success === true instead */
  isSuccess: boolean;

  isLoadingFresh: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isCachedData: boolean;
  /** @deprecated Use response?.message instead */
  statusMessage: TranslatedKeyType | undefined;
  status: "loading" | "success" | "error" | "idle";
  refetch: () => Promise<ResponseType<TResponse>>;
  remove: () => void;
  /**
   * Set error type for the query
   * @param error - The error to set or null to clear
   * @deprecated Use response property instead
   */
  setErrorType: (error: ErrorResponseType | null) => void;
  /** The React Query cache key string used for this query. */
  cacheKey: string;
}

/**
 * Type for the API query options
 */
export interface ApiQueryOptions<
  TRequest,
  TResponse,
  TUrlVariables,
> extends Omit<
  UseQueryOptions<TResponse, DefaultError, TResponse, QueryKey>,
  "queryFn" | "initialData" | "queryKey"
> {
  queryKey?: string;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (
    data: {
      responseData: TResponse;
      requestData: TRequest;
      urlPathParams: TUrlVariables;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ) => ErrorResponseType | void | Promise<ErrorResponseType | void>;
  onError?: (data: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
  }) => void;
  disableLocalCache?: boolean; // Option to disable local caching
  cacheDuration?: number; // Override default cache duration in ms
  deduplicateRequests?: boolean; // Option to disable request deduplication
  refreshDelay?: number; // Delay for refreshing stale data
  forceRefresh?: boolean; // Force refetch even if data is fresh
  backgroundRefresh?: boolean; // Refresh data in background after returning cached data
}

/**
 * Type for the API mutation options
 */
export interface ApiMutationOptions<TRequest, TResponse, TUrlVariables> {
  onSuccess?: (data: {
    requestData: TRequest;
    pathParams: TUrlVariables;
    responseData: TResponse;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }) => ErrorResponseType | void | Promise<ErrorResponseType | void>;
  onError?: (data: {
    error: ErrorResponseType;
    requestData: TRequest;
    pathParams: TUrlVariables;
    logger: EndpointLogger;
  }) => void | Promise<void>;
  invalidateQueries?: string[]; // List of queries to invalidate after mutation
}

/**
 * Type for the API query form options
 */
export interface ApiQueryFormOptions<
  TRequest,
> extends ApiFormOptions<TRequest> {
  autoSubmit?: boolean; // Whether to automatically submit the form when values change
  debounceMs?: number; // Debounce time in ms for auto-submission
}

/**
 * Return type for useApiQueryForm hook combining form and query functionality
 */
export interface ApiQueryFormReturn<
  TRequest extends FieldValues,
  TResponse,
  TUrlVariables,
  TFormValues = TRequest,
> extends ApiFormReturn<TRequest, TResponse, TUrlVariables, TFormValues> {
  /** The React Query cache key string used for this query. */
  cacheKey: string;
  // Query-specific properties - backward compatibility
  /** @deprecated Use response.success and response.data instead */
  data: TResponse | undefined;
  /** @deprecated Use response.success === false ? response : undefined instead */
  error: ErrorResponseType | undefined;
  /** @deprecated Use !response?.success instead */
  isError: boolean;
  /** @deprecated Use response?.success === true instead */
  isSuccess: boolean;
  /** @deprecated Use response?.success === false ? response.message : undefined instead */
  errorMessage?: string;

  isLoading: boolean;
  isLoadingFresh: boolean;
  isFetching: boolean;
  isCachedData: boolean;
  status: "loading" | "success" | "error" | "idle";
  refetch: () => Promise<ResponseType<TResponse>>;
  /** Remove cached query data, forcing a fresh fetch on next request. */
  remove: () => void;
  /**
   * Set error type for both the form and query
   * @param error - The error to set or null to clear
   * @deprecated Use response property instead
   */
  setErrorType: (error: ErrorResponseType | null) => void;
}

// Form-specific types.
//
// TFormValues is the flat value type the form actually holds: request-data
// fields merged with url-path-param fields (a pure url-path-param field still
// has a real form widget, so it must live in the form). It defaults to TRequest
// so existing call sites that only deal with request data are unaffected; the
// API form hooks pass the endpoint's `FormValues` (RequestOutput ∪
// UrlVariablesOutput) explicitly. On submit the flat values are split back into
// { data, urlPathParams } — which is why the submit/callback types stay keyed on
// TRequest/TUrlVariables, not TFormValues.
export type ApiFormOptions<TRequest, TFormValues = TRequest> =
  // @ts-expect-error - TFormValues is not a FieldValues type
  UseFormProps<TFormValues> & {
    defaultValues?: Partial<TFormValues>;
    /**
     * Whether to enable form persistence using localStorage
     * @default true
     */
    persistForm?: boolean;
    /**
     * The key to use for storing form data in localStorage
     * If not provided, a key will be generated based on the endpoint
     */
    persistenceKey?: string;
  };

export interface ApiFormReturn<
  TRequest,
  TResponse,
  TUrlVariables,
  TFormValues = TRequest,
> {
  //@ts-expect-error - TFormValues is not a FieldValues type
  form: UseFormReturn<TFormValues>;

  /** The complete response including success/error state */
  response: ResponseType<TResponse> | undefined;

  // Computed properties for backward compatibility
  /** @deprecated Use response?.success === true instead */
  isSubmitSuccessful: boolean;
  /** @deprecated Use response?.success === false ? response : undefined instead */
  submitError: ErrorResponseType | undefined;

  isSubmitting: boolean;
  submitForm: SubmitFormFunction<TRequest, TResponse, TUrlVariables>;
  /**
   * Function to clear the saved form data from localStorage
   * Only available if form persistence is enabled (default)
   */
  clearSavedForm: () => void;
  /**
   * Set error type for the form
   * @param error - The error to set or null to clear
   * @deprecated Use response property instead
   */
  setErrorType: (error: ErrorResponseType | null) => void;
}

export type SubmitFormFunction<TRequest, TResponse, TUrlVariables> = (
  options?: SubmitFormFunctionOptions<TRequest, TResponse, TUrlVariables>,
) => Promise<void> | void;

export interface SubmitFormFunctionOptions<TRequest, TResponse, TUrlVariables> {
  urlParamVariables?: TUrlVariables;
  onSuccess?: (data: {
    requestData: TRequest;
    pathParams: TUrlVariables;
    responseData: TResponse;
  }) => ErrorResponseType | void;
  onError?: (data: {
    error: ErrorResponseType;
    requestData: TRequest;
    pathParams: TUrlVariables;
  }) => void;
}
