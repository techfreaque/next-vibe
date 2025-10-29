/**
 * Payment Portal API Hooks
 * Simplified hooks for interacting with the Payment Portal API
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import type {
  InferApiFormReturn,
  InferEnhancedMutationResult,
} from "../../system/unified-interface/react/hooks/types";
import { useApiMutation } from "../../system/unified-interface/react/hooks/use-api-mutation";
import { useApiForm } from "../../system/unified-interface/react/hooks/use-api-mutation-form";
import type { PaymentPortalRequestOutput } from "./definition";
import definitions from "./definition";

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for creating customer portal sessions
 */
export function useCreateCustomerPortal(params: {
  logger: EndpointLogger;
  defaultValues?: Partial<PaymentPortalRequestOutput>;
}): InferApiFormReturn<typeof definitions.POST> {
  return useApiForm(definitions.POST, params.logger, {
    defaultValues: params.defaultValues,
  });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for customer portal mutation
 */
export function useCreateCustomerPortalMutation(
  logger: EndpointLogger,
): InferEnhancedMutationResult<typeof definitions.POST> {
  return useApiMutation(definitions.POST, logger);
}

/****************************
 * CONVENIENCE HOOKS
 ****************************/

/**
 * Hook for customer portal with simplified interface
 */
export function useCustomerPortal(logger: EndpointLogger): {
  createPortalSession: (
    returnUrl?: string,
  ) => Promise<
    Awaited<
      ReturnType<
        InferEnhancedMutationResult<typeof definitions.POST>["mutateAsync"]
      >
    >
  >;
  isPending: boolean;
  error: InferEnhancedMutationResult<typeof definitions.POST>["error"];
} {
  const createMutation = useCreateCustomerPortalMutation(logger);

  const createPortalSession = async (
    returnUrl?: string,
  ): Promise<
    Awaited<
      ReturnType<
        InferEnhancedMutationResult<typeof definitions.POST>["mutateAsync"]
      >
    >
  > => {
    return await createMutation.mutateAsync({
      requestData: {
        returnUrl,
      },
      urlPathParams: undefined as never,
    });
  };

  return {
    createPortalSession,
    isPending: createMutation.isPending,
    error: createMutation.error,
  };
}
