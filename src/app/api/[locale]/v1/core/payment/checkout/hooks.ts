/**
 * Subscription Checkout API Hooks
 * Type-safe hooks for subscription checkout operations
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

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import type { BillingIntervalValue, SubscriptionPlanValue } from "../../subscription/enum";
import type { CheckoutResponseOutput } from "./definition";
import checkoutEndpoints from "./definition";

/**
 * Hook for subscription checkout
 * Provides both form (create) and mutation operations
 */
export function useSubscriptionCheckout(
  logger: EndpointLogger,
): EndpointReturn<typeof checkoutEndpoints> {
  return useEndpoint(checkoutEndpoints, {}, logger);
}

/**
 * Hook for subscription checkout with simplified interface
 * Provides a convenience wrapper around the main hook
 */
export function useSimplifiedCheckout(logger: EndpointLogger): {
  createCheckout: (
    planId: SubscriptionPlanValue,
    billingInterval: BillingIntervalValue,
    metadata?: Record<string, string>,
  ) => Promise<ResponseType<CheckoutResponseOutput>>;
  isPending: boolean;
  error: ErrorResponseType | null;
} {
  const endpoint = useSubscriptionCheckout(logger);

  const createCheckout = async (
    planId: SubscriptionPlanValue,
    billingInterval: BillingIntervalValue,
    metadata?: Record<string, string>,
  ): Promise<ResponseType<CheckoutResponseOutput>> => {
    if (!endpoint.create) {
      return createErrorResponse(
        "app.api.v1.core.subscription.checkout.error",
        ErrorResponseTypes.UNKNOWN_ERROR,
      );
    }

    return new Promise((resolve) => {
      try {
        // Set form values
        endpoint.create.form.reset({
          planId,
          billingInterval,
          metadata,
        });

        // Submit form with onSuccess callback to get the response
        void endpoint.create.submitForm(undefined, {
          onSuccess: ({ responseData }) => {
            resolve({
              success: true,
              data: responseData,
              message: "app.api.v1.core.payment.checkout.post.success.description",
            });
          },
          onError: ({ error }) => {
            resolve(
              createErrorResponse(
                error.message ?? "app.api.v1.core.subscription.checkout.error",
                ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                error.messageParams,
              ),
            );
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          resolve(
            createErrorResponse(
              "app.api.v1.core.subscription.checkout.error",
              ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              { error: error.message },
            ),
          );
        } else {
          resolve(
            createErrorResponse(
              "app.api.v1.core.subscription.checkout.error",
              ErrorResponseTypes.UNKNOWN_ERROR,
            ),
          );
        }
      }
    });
  };

  return {
    createCheckout,
    isPending: endpoint.create?.isSubmitting ?? false,
    error: endpoint.create?.error ?? null,
  };
}

export type SubscriptionCheckoutEndpointReturn =
  EndpointReturn<typeof checkoutEndpoints>;
