// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import type { ErrorResponseType, ResponseType } from "next-vibe/shared/types/response.schema";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import type { ApiMutationOptions } from "./types";
import { useApiMutation } from "./use-api-mutation";

/**
 * Hook for delete operations
 * Based on the mutation pattern for consistency with other hooks
 *
 * Features:
 * - Simple mutation-based delete functionality
 * - Proper error handling and loading states
 * - Type-safe with full TypeScript inference
 * - Consistent with mutation-form pattern
 */
export function useEndpointDelete<TEndpoint extends CreateApiEndpointAny>(
  deleteEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    mutationOptions?: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
  } = {},
): {
  /** The complete response including success/error state */
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined;

  // Backward compatibility properties
  /** @deprecated Use response?.success === true instead */
  isSuccess: boolean;
  /** @deprecated Use response?.success === false ? response : null instead */
  error: ErrorResponseType | null;

  submit: (data?: TEndpoint["types"]["RequestOutput"]) => Promise<void>;
  isSubmitting: boolean;
} | null {
  // Return null if endpoint is not provided
  if (!deleteEndpoint) {
    return null;
  }

  const { mutationOptions = {}, urlPathParams = {} as TEndpoint["types"]["UrlVariablesOutput"] } =
    options;

  // Use the existing mutation hook for consistency
  const mutation = useApiMutation(deleteEndpoint, logger, mutationOptions);

  // Create a submit function that calls the mutation
  const submit = useCallback(
    async (data?: TEndpoint["types"]["RequestOutput"]): Promise<void> => {
      const mutationVariables = {
        requestData: data || ({} as TEndpoint["types"]["RequestOutput"]),
        urlPathParams: urlPathParams,
      };
      await mutation.mutateAsync(mutationVariables);
    },
    [mutation, urlPathParams],
  );

  return {
    response: mutation.data,
    // Backward compatibility properties
    isSuccess: mutation.isSuccess,
    error: mutation.error,

    submit,
    isSubmitting: mutation.isPending,
  };
}
