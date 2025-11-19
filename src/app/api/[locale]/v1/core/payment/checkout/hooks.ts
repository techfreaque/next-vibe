/**
 * Subscription Checkout API Hooks
 * Type-safe hooks for subscription checkout operations
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useCallback } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import { handleCheckoutRedirect } from "../utils/redirect";
import { BillingInterval, SubscriptionPlan } from "../../subscription/enum";
import type {
  BillingIntervalValue,
  SubscriptionPlanValue,
} from "../../subscription/enum";
import type {
  CheckoutRequestOutput,
  CheckoutResponseOutput,
} from "./definition";
import checkoutEndpoints from "./definition";

/**
 * Hook for subscription checkout
 * Provides both form (create) and mutation operations with automatic Stripe redirect
 */
export function useSubscriptionCheckout(
  logger: EndpointLogger,
): EndpointReturn<typeof checkoutEndpoints> {
  const { toast } = useToast();
  const { t } = useTranslation();

  // Success callback for subscription checkout
  const handleCheckoutSuccess = useCallback(
    async (data: {
      requestData: CheckoutRequestOutput;
      pathParams: Record<string, never>;
      responseData: CheckoutResponseOutput;
    }) => {
      try {
        logger.debug("app.api.v1.core.payment.checkout.onSuccess.start");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData },
          (errorMessage) => {
            logger.error("app.api.v1.core.payment.checkout.redirect.failed", {
              error: errorMessage,
            });
            toast({
              title: t("app.common.error.title"),
              description: errorMessage,
              variant: "destructive",
            });
          },
        );

        if (!redirected) {
          logger.error("app.api.v1.core.payment.checkout.redirect.failed");
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.payment.checkout.process.failed",
          parseError(error),
        );
        toast({
          title: t("app.common.error.title"),
          description: t("app.common.error.description"),
          variant: "destructive",
        });
      }
    },
    [logger, toast, t],
  );

  // Error callback for subscription checkout
  const handleCheckoutError = useCallback(
    async (data: {
      error: ErrorResponseType;
      requestData: CheckoutRequestOutput;
      pathParams: Record<string, never>;
    }) => {
      logger.error(
        "app.api.v1.core.payment.checkout.error",
        parseError(data.error),
      );
      // Toast is handled by useEndpoint's alert system
    },
    [logger],
  );

  return useEndpoint(
    checkoutEndpoints,
    {
      create: {
        formOptions: {
          persistForm: false,
          defaultValues: {
            planId: SubscriptionPlan.SUBSCRIPTION,
            billingInterval: BillingInterval.MONTHLY,
          },
        },
        mutationOptions: {
          onSuccess: handleCheckoutSuccess,
          onError: handleCheckoutError,
        },
      },
    },
    logger,
  );
}

/**
 * Hook for subscription checkout with simplified interface
 * Provides a convenience wrapper around the main hook
 */
export function useCheckout(logger: EndpointLogger): {
  createCheckout: (
    planId: typeof SubscriptionPlanValue,
    billingInterval: typeof BillingIntervalValue,
    metadata?: Record<string, string>,
  ) => Promise<ResponseType<CheckoutResponseOutput>>;
  isPending: boolean;
  error: ErrorResponseType | null;
} {
  const endpoint = useSubscriptionCheckout(logger);

  const createCheckout = async (
    planId: typeof SubscriptionPlanValue,
    billingInterval: typeof BillingIntervalValue,
    metadata?: Record<string, string>,
  ): Promise<ResponseType<CheckoutResponseOutput>> => {
    if (!endpoint.create) {
      return fail({
        message: "app.api.v1.core.subscription.checkout.error",
        errorType: ErrorResponseTypes.UNKNOWN_ERROR,
      });
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
        void endpoint.create.submitForm({
          onSuccess: ({ responseData }) => {
            resolve({
              success: true,
              data: responseData,
            });
          },
          onError: ({ error }) => {
            resolve(
              fail({
                message:
                  error.message ??
                  "app.api.v1.core.subscription.checkout.error",
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                messageParams: error.messageParams,
              }),
            );
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          resolve(
            fail({
              message: "app.api.v1.core.subscription.checkout.error",
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: { error: error.message },
            }),
          );
        } else {
          resolve(
            fail({
              message: "app.api.v1.core.subscription.checkout.error",
              errorType: ErrorResponseTypes.UNKNOWN_ERROR,
            }),
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

export type SubscriptionCheckoutEndpointReturn = EndpointReturn<
  typeof checkoutEndpoints
>;
