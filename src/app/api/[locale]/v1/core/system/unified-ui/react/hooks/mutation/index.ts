"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { useCallback, useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { useTranslation } from "@/i18n/core/client";

import type { AnyData, ApiStore, MutationStoreType } from "../store";
import { useApiStore } from "../store";
import type { ApiMutationOptions } from "../types";

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
export function useApiMutation<
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
  options: ApiMutationOptions<
    TEndpoint["TRequestOutput"],
    TEndpoint["TResponseOutput"],
    TEndpoint["TUrlVariablesOutput"]
  > = {},
): EnhancedMutationResult<
  TEndpoint["TResponseOutput"],
  TEndpoint["TRequestOutput"],
  TEndpoint["TUrlVariablesOutput"]
> {
  // Get API store methods
  const { executeMutation, getMutationId } = useApiStore();
  const { t, locale } = useTranslation();

  // Get mutation ID
  const mutationId = useMemo(
    () => getMutationId(endpoint),
    [getMutationId, endpoint],
  );

  // Track error state
  const [localError, setLocalError] = useState<ErrorResponseType | null>(null);

  // Default state for the mutation
  const defaultState: MutationStoreType<TEndpoint["TResponseOutput"]> = useMemo(
    () => ({
      response: undefined,
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
      statusMessage: undefined,
    }),
    [],
  );

  // Create a selector function for the store
  const selector = useCallback(
    (state: ApiStore): MutationStoreType<TEndpoint["TResponseOutput"]> => {
      const mutation = state.mutations[mutationId];
      return (
        (mutation as MutationStoreType<TEndpoint["TResponseOutput"]>) ??
        defaultState
      );
    },
    [mutationId, defaultState],
  );

  // Get mutation state from store with shallow comparison
  const mutationState = useApiStore(selector);

  // Create a type-safe mutate function that accepts both data and urlPathParams
  const mutate = useCallback(
    (
      variables: MutationVariables<
        TEndpoint["TRequestOutput"],
        TEndpoint["TUrlVariablesOutput"]
      >,
    ) => {
      // Clear any existing error when starting a new mutation
      setLocalError(null);

      // Handle the case where variables is an empty object (for endpoints with no request data)
      const requestData =
        "requestData" in variables
          ? variables.requestData
          : ({} as TEndpoint["TRequestOutput"]);
      const urlPathParams =
        "urlPathParams" in variables
          ? variables.urlPathParams
          : ({} as TEndpoint["TUrlVariablesOutput"]);

      void executeMutation(
        endpoint,
        logger,
        requestData,
        urlPathParams,
        t,
        locale,
        options,
      );
    },
    [executeMutation, endpoint, logger, t, locale, options],
  );

  // Create a type-safe mutateAsync function
  const mutateAsync = useCallback(
    async (
      variables: MutationVariables<
        TEndpoint["TRequestOutput"],
        TEndpoint["TUrlVariablesOutput"]
      >,
    ): Promise<ResponseType<TEndpoint["TResponseOutput"]>> => {
      try {
        // Clear any existing error when starting a new mutation
        setLocalError(null);

        // Handle the case where variables is an empty object (for endpoints with no request data)
        const requestData =
          "requestData" in variables
            ? variables.requestData
            : ({} as TEndpoint["TRequestOutput"]);
        const urlPathParams =
          "urlPathParams" in variables
            ? variables.urlPathParams
            : ({} as TEndpoint["TUrlVariablesOutput"]);

        const response = await executeMutation(
          endpoint,
          logger,
          requestData,
          urlPathParams,
          t,
          locale,
          options,
        );

        // Ensure we return a proper ResponseType
        return typeof response === "object" &&
          response !== null &&
          "success" in response
          ? response
          : createSuccessResponse(response);
      } catch (error) {
        // Create a properly typed error response
        const errorResponse = createErrorResponse(
          "app.common.errors.unknown",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            error: parseError(error).message,
            endpoint: endpoint.path.join("/"),
          },
        );

        // Set the local error state
        setLocalError(errorResponse);

        return errorResponse;
      }
    },
    [executeMutation, endpoint, logger, t, locale, options],
  );

  // Helper function for updating mutation state
  const updateMutationState = useCallback(
    (updates: Partial<MutationStoreType<TEndpoint["TResponseOutput"]>>) => {
      useApiStore.setState((state) => {
        const mutations = { ...state.mutations };
        const existingMutation = mutations[mutationId];
        if (existingMutation) {
          mutations[mutationId] = {
            ...existingMutation,
            ...updates,
          } as MutationStoreType<AnyData>;
        }
        return { mutations };
      });
    },
    [mutationId],
  );

  // Reset mutation state
  const reset = useCallback(() => {
    // Clear the local error state
    setLocalError(null);

    updateMutationState({
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
    });
  }, [updateMutationState]);

  // Function to set error type
  const setErrorType = useCallback(
    (error: ErrorResponseType | null): void => {
      setLocalError(error);

      // Also update the store if needed
      if (error !== null) {
        updateMutationState({
          isError: true,
          error,
          isSuccess: false,
        });
      }
    },
    [updateMutationState],
  );

  // Create a result object that matches React Query's UseMutationResult
  return useMemo(() => {
    // Convert data to ResponseType if needed
    const data = mutationState.data
      ? typeof mutationState.data === "object" &&
        mutationState.data !== null &&
        "success" in mutationState.data &&
        "data" in mutationState.data
        ? (mutationState.data as ResponseType<TEndpoint["TResponseOutput"]>)
        : createSuccessResponse(
            mutationState.data as TEndpoint["TResponseOutput"],
          )
      : undefined;

    // Use local error state if it exists, otherwise fall back to store error
    const error = localError || mutationState.error;

    return {
      mutate,
      mutateAsync,
      isPending: mutationState.isPending,
      isError: mutationState.isError || !!localError,
      error,
      isSuccess: mutationState.isSuccess && !localError,
      data,
      reset,
      status: mutationState.isPending
        ? "pending"
        : mutationState.isError || !!localError
          ? "error"
          : mutationState.isSuccess && !localError
            ? "success"
            : "idle",
      setErrorType,
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      context: undefined as
        | MutationContext<
            TEndpoint["TRequestOutput"],
            TEndpoint["TUrlVariablesOutput"]
          >
        | undefined,
    };
  }, [mutationState, mutate, mutateAsync, reset, localError, setErrorType]);
}
