import type {
  DefaultError,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { FormEvent } from "react";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { EnhancedMutationResult } from "./mutation";

/**
 * Utility types to extract types from CreateApiEndpoint definitions
 * These allow hooks to infer return types from endpoint definitions
 */

/**
 * Extract types from an CreateApiEndpoint for ApiFormReturn
 */
export type InferApiFormReturn<T> =
  T extends CreateApiEndpoint<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TRequestInput,
    infer TRequestOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TResponseInput,
    infer TResponseOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUrlVariablesInput,
    infer TUrlVariablesOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TExampleKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUserRoleValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TFields
  >
    ? ApiFormReturn<TRequestOutput, TResponseOutput, TUrlVariablesOutput>
    : never;

/**
 * Extract types from an CreateApiEndpoint for ApiQueryReturn
 */
export type InferApiQueryReturn<T> =
  T extends CreateApiEndpoint<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TRequestInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TRequestOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TResponseInput,
    infer TResponseOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUrlVariablesInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUrlVariablesOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TExampleKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUserRoleValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TFields
  >
    ? ApiQueryReturn<TResponseOutput>
    : never;

/**
 * Extract types from an CreateApiEndpoint for ApiQueryFormReturn
 */
export type InferApiQueryFormReturn<T> =
  T extends CreateApiEndpoint<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TRequestInput,
    infer TRequestOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TResponseInput,
    infer TResponseOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUrlVariablesInput,
    infer TUrlVariablesOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TExampleKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUserRoleValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TFields
  >
    ? ApiQueryFormReturn<TRequestOutput, TResponseOutput, TUrlVariablesOutput>
    : never;

/**
 * Extract types from an CreateApiEndpoint for EnhancedMutationResult
 */
export type InferEnhancedMutationResult<T> =
  T extends CreateApiEndpoint<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TRequestInput,
    infer TRequestOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TResponseInput,
    infer TResponseOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUrlVariablesInput,
    infer TUrlVariablesOutput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TExampleKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TUserRoleValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TFields
  >
    ? EnhancedMutationResult<
        TResponseOutput,
        TRequestOutput,
        TUrlVariablesOutput
      >
    : never;

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
  statusMessage: TranslationKey | undefined;
  status: "loading" | "success" | "error" | "idle";
  refetch: () => Promise<ResponseType<TResponse>>;
  remove: () => void;
  /**
   * Set error type for the query
   * @param error - The error to set or null to clear
   * @deprecated Use response property instead
   */
  setErrorType: (error: ErrorResponseType | null) => void;
}

/**
 * Type for the API query options
 */
export interface ApiQueryOptions<TRequest, TResponse, TUrlVariables>
  extends Omit<
    UseQueryOptions<TResponse, DefaultError, TResponse, QueryKey>,
    "queryFn" | "initialData" | "queryKey"
  > {
  queryKey?: QueryKey;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: {
    responseData: TResponse;
    requestData: TRequest;
    urlParams: TUrlVariables;
  }) => ErrorResponseType | void;
  onError?: (data: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlParams: TUrlVariables;
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
  }) => ErrorResponseType | void | Promise<ErrorResponseType | void>;
  onError?: (data: {
    error: ErrorResponseType;
    requestData: TRequest;
    pathParams: TUrlVariables;
  }) => void | Promise<void>;
  invalidateQueries?: string[]; // List of queries to invalidate after mutation
}

/**
 * Type for the API query form options
 */
export interface ApiQueryFormOptions<TRequest>
  extends ApiFormOptions<TRequest> {
  autoSubmit?: boolean; // Whether to automatically submit the form when values change
  debounceMs?: number; // Debounce time in ms for auto-submission
}

/**
 * Return type for useApiQueryForm hook combining form and query functionality
 */
export interface ApiQueryFormReturn<TRequest, TResponse, TUrlVariables>
  extends ApiFormReturn<TRequest, TResponse, TUrlVariables> {
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
  isFetching: boolean;
  status: "loading" | "success" | "error" | "idle";
  refetch: () => Promise<ResponseType<TResponse>>;
  /**
   * Set error type for both the form and query
   * @param error - The error to set or null to clear
   * @deprecated Use response property instead
   */
  setErrorType: (error: ErrorResponseType | null) => void;
}

// Form-specific types
// @ts-ignore - Intentionally ignoring FieldValues constraint requirement
export type ApiFormOptions<TRequest> = UseFormProps<TRequest> & {
  defaultValues?: Partial<TRequest>;
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

export interface ApiFormReturn<TRequest, TResponse, TUrlVariables> {
  // @ts-ignore - Intentionally ignoring FieldValues constraint requirement
  form: UseFormReturn<TRequest, ZodType<TRequest, TRequest>>;

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
  event: FormEvent<HTMLFormElement> | undefined,
  options?: SubmitFormFunctionOptions<TRequest, TResponse, TUrlVariables>,
) => Promise<void> | void;

export interface SubmitFormFunctionOptions<TRequest, TResponse, TUrlVariables> {
  urlParamVariables: TUrlVariables;
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
