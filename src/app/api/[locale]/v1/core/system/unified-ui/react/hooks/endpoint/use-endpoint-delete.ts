// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { useApiMutation } from "../mutation";
import type { ApiMutationOptions } from "../types";

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
export function useEndpointDelete<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >,
>(
  deleteEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    mutationOptions?: ApiMutationOptions<
      TEndpoint["TRequestOutput"],
      TEndpoint["TResponseOutput"],
      TEndpoint["TUrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["TUrlVariablesOutput"];
  } = {},
): {
  /** The complete response including success/error state */
  response: ResponseType<TEndpoint["TResponseOutput"]> | undefined;

  // Backward compatibility properties
  /** @deprecated Use response?.success === true instead */
  isSuccess: boolean;
  /** @deprecated Use response?.success === false ? response : null instead */
  error: ErrorResponseType | null;

  submit: (data?: TEndpoint["TRequestOutput"]) => Promise<void>;
  isSubmitting: boolean;
} | null {
  // Return null if endpoint is not provided
  if (!deleteEndpoint) {
    return null;
  }

  const {
    mutationOptions = {},
    urlPathParams = {} as TEndpoint["TUrlVariablesOutput"],
  } = options;

  // Use the existing mutation hook for consistency
  const mutation = useApiMutation(deleteEndpoint, logger, mutationOptions);

  // Create a submit function that calls the mutation
  const submit = useCallback(
    async (data?: TEndpoint["TRequestOutput"]): Promise<void> => {
      await mutation.mutateAsync({
        requestData: data || ({} as TEndpoint["TRequestOutput"]),
        urlPathParams: urlPathParams,
      });
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
