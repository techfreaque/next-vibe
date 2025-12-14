"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint";
import { executeMutation } from "./mutation-executor";
import type { ApiMutationOptions } from "./types";

/**
 * Type for mutation variables
 * When both TRequest and TUrlVariables are never (no request data needed),
 * the variables should be an empty object.
 * When TUrlVariables is never, urlPathParams is optional (can be omitted).
 */
export type MutationVariables<TRequest, TUrlVariables> = [TRequest] extends [
  never,
]
  ? [TUrlVariables] extends [never]
    ? Record<string, never> // Both are never - empty object
    : { requestData: TRequest; urlPathParams: TUrlVariables }
  : [TUrlVariables] extends [never]
    ? { requestData: TRequest; urlPathParams?: never } // TRequest exists, TUrlVariables is never - urlPathParams is optional
    : { requestData: TRequest; urlPathParams: TUrlVariables };

/**
 * Mutation context type for tracking additional mutation state
 */
export interface MutationContext<TRequest, TUrlVariables> {
  /**
   * The variables that were passed to the mutation
   */
  variables?: MutationVariables<TRequest, TUrlVariables>;
  /**
   * Timestamp when the mutation was initiated
   */
  initiatedAt?: number;
  /**
   * Any additional metadata for the mutation
   */
  metadata?: {
    retryCount?: number;
    source?: string;
  };
}

/**
 * Enhanced mutation result type
 */
export type EnhancedMutationResult<TResponse, TRequest, TUrlVariables> = Omit<
  UseMutationResult<
    ResponseType<TResponse>,
    ErrorResponseType,
    MutationVariables<TRequest, TUrlVariables>,
    MutationContext<TRequest, TUrlVariables>
  >,
  "mutate" | "mutateAsync" | "isIdle" | "isPaused" | "submittedAt"
> & {
  /**
   * Asynchronously perform the mutation and return a promise
   */
  mutateAsync: (
    variables: MutationVariables<TRequest, TUrlVariables>,
  ) => Promise<ResponseType<TResponse>>;

  /**
   * Perform the mutation without waiting for the result
   */
  mutate: (variables: MutationVariables<TRequest, TUrlVariables>) => void;

  /**
   * Set error type for the mutation
   * @param error - The error to set or null to clear
   */
  setErrorType: (error: ErrorResponseType | null) => void;

  /**
   * Current error state
   */
  error: ErrorResponseType | null;

  /**
   * Additional properties to match React Query's UseMutationResult
   */
  variables: MutationVariables<TRequest, TUrlVariables> | undefined;
  failureCount: number;
  failureReason: ErrorResponseType | null;
  context: MutationContext<TRequest, TUrlVariables> | undefined;
};

/**
 * React Query hook for mutation requests (POST, PUT, DELETE, etc.)
 * @param endpoint - The endpoint to call
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useApiMutation<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  options: ApiMutationOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  > = {},
): EnhancedMutationResult<
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> {
  const { locale } = useTranslation();

  // Track error state for backward compatibility
  const [localError, setLocalError] = useState<ErrorResponseType | null>(null);

  // Use React Query's useMutation
  const mutation = useMutation<
    ResponseType<TEndpoint["types"]["ResponseOutput"]>,
    ErrorResponseType,
    MutationVariables<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >,
    MutationContext<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >
  >({
    mutationFn: async (variables) => {
      // Clear any existing error when starting a new mutation
      setLocalError(null);

      // Handle the case where variables is an empty object (for endpoints with no request data)
      const requestData =
        "requestData" in variables
          ? variables.requestData
          : ({} as TEndpoint["types"]["RequestOutput"]);
      const urlPathParams =
        "urlPathParams" in variables
          ? variables.urlPathParams
          : ({} as TEndpoint["types"]["UrlVariablesOutput"]);

      // Call mutation executor
      const response = await executeMutation({
        endpoint: endpoint as never,
        logger,
        requestData: requestData as never,
        pathParams: urlPathParams as never,
        locale,
        options: {
          onSuccess: options.onSuccess
            ? (
                context,
              ): void | ErrorResponseType | Promise<void | ErrorResponseType> =>
                options.onSuccess?.({
                  requestData: context.requestData,
                  pathParams: context.urlPathParams,
                  responseData: context.responseData,
                })
            : undefined,
          onError: options.onError
            ? (context): void | Promise<void> =>
                options.onError?.({
                  error: context.error,
                  requestData: context.requestData,
                  pathParams: context.urlPathParams,
                })
            : undefined,
        },
      });

      // If response is an error, throw it so React Query treats it as an error
      if (!response.success) {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- React Query pattern: Throwing inside mutation function is the standard way to trigger onError callback. This is documented React Query behavior.
        throw response;
      }

      return response;
    },
    onError: (error) => {
      setLocalError(error);
    },
  });

  // Function to set error type for backward compatibility
  const setErrorType = (error: ErrorResponseType | null): void => {
    setLocalError(error);
  };

  // Return enhanced mutation result with backward-compatible interface
  return {
    // React Query's useMutation properties
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: localError || mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
    status: mutation.status,

    // Backward compatibility properties
    setErrorType,
    variables: mutation.variables,
    failureCount: mutation.failureCount,
    failureReason: mutation.failureReason,
    context: mutation.context,
  };
}
