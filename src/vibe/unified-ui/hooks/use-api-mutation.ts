"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { type CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { useTranslation } from "../../core/i18n/core/client";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import {
  buildMutationExceptionResponse,
  executeMutation,
  settleMutationResult,
} from "./mutation-executor";
import type { ApiMutationOptions } from "./types";

/**
 * Type for mutation variables
 * Union type supporting all valid combinations of request data and URL path parameters
 */
type MutationData<TRequest, TUrlVariables> =
  // Check if TRequest is never
  [TRequest] extends [never]
    ? // TRequest is never, check TUrlVariables
      [TUrlVariables] extends [never]
      ? // Both are never - allow empty object
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        { requestData?: undefined | never; urlPathParams?: undefined | never }
      : // Only TUrlVariables exists
        { requestData?: undefined | never; urlPathParams: TUrlVariables }
    : // TRequest exists, check TUrlVariables
      [TUrlVariables] extends [never]
      ? // Only TRequest exists
        { requestData: TRequest; urlPathParams?: undefined | never }
      : // Both exist
        { requestData: TRequest; urlPathParams: TUrlVariables };

export type MutationVariables<TRequest, TUrlVariables> = MutationData<
  TRequest,
  TUrlVariables
> & {
  /** Receives the correlation ID of each HTTP attempt before dispatch. */
  onRequestId?: (requestId: string) => void;
};

/**
 * Mutation context type for tracking additional mutation state
 */
interface MutationContext<TRequest, TUrlVariables> {
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
  user: JwtPayloadType,
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
      const response = await executeMutation<TEndpoint>({
        endpoint,
        logger,
        requestData,
        pathParams: urlPathParams,
        locale,
        user,
        onRequestId: variables.onRequestId,
        options: {
          onSuccess: options.onSuccess
            ? (
                context,
              ):
                | void
                | ErrorResponseType
                | Promise<void | ErrorResponseType> => {
                return options.onSuccess?.({
                  requestData: context.requestData,
                  pathParams: context.urlPathParams,
                  responseData: context.responseData,
                  logger: context.logger,
                  user: context.user,
                  locale: context.locale,
                });
              }
            : undefined,
          onError: options.onError
            ? (context): void | Promise<void> =>
                options.onError?.({
                  error: context.error,
                  requestData: context.requestData,
                  pathParams: context.urlPathParams,
                  logger: context.logger,
                })
            : undefined,
        },
      });

      // If response is an error, throw it so React Query treats it as an error
      if (!response.success) {
        // eslint-disable-next-line restricted/no-throw -- React Query pattern: Throwing inside mutation function is the standard way to trigger onError callback. This is documented React Query behavior.
        throw response;
      }

      return response;
    },
    onError: (error) => {
      setLocalError(error);
    },
  });

  // RQ's mutateAsync rejects with the ErrorResponseType thrown above. Our
  // contract is Promise<ResponseType<T>>: failure resolves as a value, so
  // callers' `if (!result.success)` branches run and nothing leaks an
  // unhandled rejection. Depends only on RQ's (stable) mutateAsync; the
  // unexpected-error context is read from a ref so a caller passing a fresh
  // logger/endpoint per render cannot destabilise it.
  const unexpectedContextRef = useRef({ endpoint, locale, logger });
  useLayoutEffect(() => {
    unexpectedContextRef.current = { endpoint, locale, logger };
  });
  const rqMutateAsync = mutation.mutateAsync;
  const mutateAsync = useCallback(
    (
      variables: MutationVariables<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      >,
    ): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> =>
      settleMutationResult(
        () => rqMutateAsync(variables),
        (parsedError) => {
          const ctx = unexpectedContextRef.current;
          ctx.logger.error("Mutation rejected with a non-response error", {
            endpoint: ctx.endpoint.path.join("/"),
            error: parsedError,
          });
          return buildMutationExceptionResponse(
            ctx.endpoint,
            ctx.locale,
            parsedError,
          );
        },
      ),
    [rqMutateAsync],
  );

  // Stable setErrorType function
  const setErrorType = useCallback((error: ErrorResponseType | null): void => {
    setLocalError(error);
  }, []);

  // Return enhanced mutation result with stable references.
  // Only include deps that have real functional impact on consumers:
  // - mutate/mutateAsync: the callable functions (stable useCallbacks)
  // - status/isPending/isError/isSuccess: primitive state flags
  // - data/error: the actual result values
  // - reset: stable function from RQ
  // Intentionally excluded from deps: variables, context, failureReason, failureCount
  // - these are object references RQ recreates every render even when idle (always undefined),
  // which would cause the memo to fire every render and make streamMutation/cancelMutation
  // unstable, cascading into startStream/cancelStream re-creation on every render.
  // These fields are still returned (reading from closure is fine), just not depended on.
  return useMemo(
    () => ({
      mutate: mutation.mutate,
      mutateAsync,
      isPending: mutation.isPending,
      isError: mutation.isError,
      error: localError || mutation.error,
      isSuccess: mutation.isSuccess,
      data: mutation.data,
      reset: mutation.reset,
      status: mutation.status,
      setErrorType,
      variables: mutation.variables,
      failureCount: mutation.failureCount,
      failureReason: mutation.failureReason,
      context: mutation.context,
    }),
    [
      mutation.mutate,
      mutateAsync,
      mutation.isPending,
      mutation.isError,
      mutation.error,
      mutation.isSuccess,
      mutation.data,
      mutation.reset,
      mutation.status,
      mutation.variables,
      mutation.failureCount,
      mutation.failureReason,
      mutation.context,
      localError,
      setErrorType,
    ],
  );
}
