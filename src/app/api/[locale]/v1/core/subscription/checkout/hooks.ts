/**
 * Subscription Checkout API Hooks
 * React hooks for subscription checkout operations
 */

"use client";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useApiForm } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type {
  InferApiFormReturn,
  InferEnhancedMutationResult,
} from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useApiMutation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/mutation";
import { useTranslation } from "@/i18n/core/client";

import type { BillingIntervalValue, SubscriptionPlanValue } from "../enum";
import { SubscriptionPlan } from "../enum";
import type {
  CheckoutRequestInput,
  CheckoutResponseOutput,
} from "./definition";
import checkoutEndpoints from "./definition";

/****************************
 * FORM HOOKS
 ****************************/

/**
 * Hook for creating subscription checkout sessions
 */
export function useCreateSubscriptionCheckout(
  defaultValues?: CheckoutRequestInput,
): InferApiFormReturn<typeof checkoutEndpoints.POST> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  return useApiForm(checkoutEndpoints.POST, logger, { defaultValues });
}

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for subscription checkout mutation
 */
export function useCreateSubscriptionCheckoutMutation(): InferEnhancedMutationResult<
  typeof checkoutEndpoints.POST
> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  return useApiMutation(checkoutEndpoints.POST, logger);
}

/****************************
 * CONVENIENCE HOOKS
 ****************************/

/**
 * Hook for subscription checkout with simplified interface
 */
export function useSubscriptionCheckout(): {
  createCheckout: (
    planId: Exclude<SubscriptionPlanValue, typeof SubscriptionPlan.ENTERPRISE>,
    billingInterval: BillingIntervalValue,
    metadata?: Record<string, string>,
  ) => Promise<ResponseType<CheckoutResponseOutput>>;
  isPending: boolean;
  error: ErrorResponseType | null;
} {
  const createMutation = useCreateSubscriptionCheckoutMutation();

  const createCheckout = async (
    planId: Exclude<SubscriptionPlanValue, typeof SubscriptionPlan.ENTERPRISE>,
    billingInterval: BillingIntervalValue,
    metadata?: Record<string, string>,
  ): Promise<ResponseType<CheckoutResponseOutput>> => {
    try {
      const result = await createMutation.mutateAsync({
        requestData: {
          planId,
          billingInterval,
          metadata,
        },
        urlParams: undefined,
      });

      if (!result.success) {
        // Return the specific error response from the API
        return createErrorResponse(
          result.message,
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          result.messageParams,
        );
      }

      return result;
    } catch (error) {
      // Handle different error types and return appropriate error responses
      if (error instanceof Error) {
        return createErrorResponse(
          "app.api.v1.core.subscription.checkout.error",
          ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          { error: error.message },
        );
      }

      // For unknown error types, return a generic checkout error
      return createErrorResponse(
        "app.api.v1.core.subscription.checkout.error",
        ErrorResponseTypes.UNKNOWN_ERROR,
      );
    }
  };

  return {
    createCheckout,
    isPending: createMutation.isPending,
    error: createMutation.error,
  };
}
