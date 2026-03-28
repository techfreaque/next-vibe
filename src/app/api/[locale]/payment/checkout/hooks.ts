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
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useCallback } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { configScopedTranslation } from "@/config/i18n";
import { useTranslation } from "@/i18n/core/client";

import type {
  BillingIntervalValue,
  SubscriptionPlanValue,
} from "../../subscription/enum";
import { BillingInterval, SubscriptionPlan } from "../../subscription/enum";
import type { JwtPayloadType } from "../../user/auth/types";
import { handleCheckoutRedirect } from "../utils/redirect";
import type {
  CheckoutRequestOutput,
  CheckoutResponseOutput,
} from "./definition";
import checkoutEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Hook for subscription checkout
 * Provides both form (create) and mutation operations with automatic Stripe redirect
 */
export function useSubscriptionCheckout(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof checkoutEndpoints> {
  const { toast } = useToast();
  const { locale } = useTranslation();
  const { t } = configScopedTranslation.scopedT(locale);

  // Success callback for subscription checkout
  const handleCheckoutSuccess = useCallback(
    (data: {
      requestData: CheckoutRequestOutput;
      pathParams: Record<string, never>;
      responseData: CheckoutResponseOutput;
    }) => {
      try {
        logger.debug("Payment checkout success callback triggered");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData },
          (errorMessage) => {
            logger.error("Stripe checkout redirect failed", {
              error: errorMessage,
            });
            toast({
              title: t("error.title"),
              description: errorMessage,
              variant: "destructive",
            });
          },
        );

        if (!redirected) {
          logger.error("Stripe checkout redirect returned false");
        }
      } catch (error) {
        logger.error("Payment checkout processing failed", parseError(error));
        toast({
          title: t("error.title"),
          description: t("error.description"),
          variant: "destructive",
        });
      }
    },
    [logger, toast, t],
  );

  // Error callback for subscription checkout
  const handleCheckoutError = useCallback(
    (data: {
      error: ErrorResponseType;
      requestData: CheckoutRequestOutput;
      pathParams: Record<string, never>;
    }) => {
      logger.error("Payment checkout endpoint error", parseError(data.error));
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
    user,
  );
}

/**
 * Hook for subscription checkout with simplified interface
 * Provides a convenience wrapper around the main hook
 */
export function useCheckout(
  logger: EndpointLogger,
  user: JwtPayloadType,
): {
  createCheckout: (
    planId: typeof SubscriptionPlanValue,
    billingInterval: typeof BillingIntervalValue,
    metadata?: Record<string, string>,
  ) => Promise<ResponseType<CheckoutResponseOutput>>;
  isPending: boolean;
  error: ErrorResponseType | null;
} {
  const endpoint = useSubscriptionCheckout(logger, user);
  const { locale } = useTranslation();
  const { t: tCheckout } = scopedTranslation.scopedT(locale);

  const createCheckout = (
    planId: typeof SubscriptionPlanValue,
    billingInterval: typeof BillingIntervalValue,
    metadata?: Record<string, string>,
  ): Promise<ResponseType<CheckoutResponseOutput>> => {
    if (!endpoint.create) {
      return Promise.resolve(
        fail({
          message: tCheckout("error"),
          errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        }),
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
                message: error.message ?? tCheckout("error"),
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
              message: tCheckout("error"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: { error: error.message },
            }),
          );
        } else {
          resolve(
            fail({
              message: tCheckout("error"),
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
