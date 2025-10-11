/**
 * Payment Portal API Hooks
 * Simplified hooks for interacting with the Payment Portal API
 */

import { useApiMutation } from "../../system/unified-ui/react/hooks/mutation";
import { useApiForm } from "../../system/unified-ui/react/hooks/mutation-form";
import type {
  InferApiFormReturn,
  InferEnhancedMutationResult,
} from "../../system/unified-ui/react/hooks/types";
import type { PaymentPortalRequestOutput } from "./definition";
import definitions from "./definition";

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for creating customer portal sessions
 */
export function useCreateCustomerPortal(
  defaultValues?: Partial<PaymentPortalRequestOutput>,
): InferApiFormReturn<typeof definitions.POST> {
  return useApiForm(definitions.POST, { defaultValues });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for customer portal mutation
 */
export function useCreateCustomerPortalMutation(): InferEnhancedMutationResult<
  typeof definitions.POST
> {
  return useApiMutation(definitions.POST);
}

/****************************
 * CONVENIENCE HOOKS
 ****************************/

/**
 * Hook for customer portal with simplified interface
 */
export function useCustomerPortal(): {
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
  const createMutation = useCreateCustomerPortalMutation();

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
      urlParams: undefined,
    });
  };

  return {
    createPortalSession,
    isPending: createMutation.isPending,
    error: createMutation.error,
  };
}
