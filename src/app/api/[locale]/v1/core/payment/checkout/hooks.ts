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
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui//hooks/use-toast";
import { useCallback } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { useTranslation } from "@/i18n/core/client";

import { handleCheckoutRedirect } from "../utils/redirect";
import type { BillingIntervalValue, SubscriptionPlanValue } from "../../subscription/enum";
import type { CheckoutResponseOutput } from "./definition";
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
      requestData: unknown;
      pathParams: unknown;
      responseData: unknown;
    }) => {
      try {
        logger.debug("app.api.v1.core.payment.checkout.onSuccess.start");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData, message: "Success" },
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
      error: unknown;
      requestData: unknown;
      pathParams: unknown;
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
            planId: "SUBSCRIPTION",
            billingInterval: "MONTHLY",
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
              message: "app.api.v1.core.subscription.checkout.success",
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
