/**
 * Credit System Hooks
 * React hooks for credit balance, history, and purchase operations
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { useToast } from "next-vibe-ui//hooks/use-toast";
import { useCallback } from "react";

import { handleCheckoutRedirect } from "@/app/api/[locale]/v1/core/payment/utils/redirect";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import definitions from "./definition";
import historyDefinitions from "./history/definition";
import purchaseDefinitions, {
  type CreditsPurchasePostRequestOutput,
  type CreditsPurchasePostResponseOutput,
} from "./purchase/definition";

/**
 * Hook for fetching current user's credit balance
 */
export function useCredits(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 0, // Always refetch (no caching) for real-time credit updates
      },
    },
    logger,
  );
}

/**
 * Hook for fetching credit transaction history
 */
export function useCreditHistory(
  logger: EndpointLogger,
): EndpointReturn<typeof historyDefinitions> {
  return useEndpoint(
    historyDefinitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
    logger,
  );
}

/**
 * Hook for purchasing credit packs
 * Provides full endpoint interface with form controls and automatic Stripe redirect
 */
export function useCreditPurchase(
  logger: EndpointLogger,
): EndpointReturn<typeof purchaseDefinitions> {
  const { toast } = useToast(); 
  const { t } = useTranslation();

  // Success callback for credit purchase
  const handlePurchaseSuccess = useCallback(
    async (data: {
      requestData: CreditsPurchasePostRequestOutput;
      pathParams: Record<string, never>;
      responseData: CreditsPurchasePostResponseOutput;
    }) => {
      try {
        logger.debug("app.api.v1.core.credits.purchase.onSuccess.start");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData },
          (errorMessage) => {
            logger.error("app.api.v1.core.credits.purchase.redirect.failed", {
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
          logger.error("app.api.v1.core.credits.purchase.redirect.failed");
        }
      } catch (error) {
        logger.error(
          "app.api.v1.core.credits.purchase.process.failed",
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

  // Error callback for credit purchase
  const handlePurchaseError = useCallback(
    async (data: {
      error: ErrorResponseType;
      requestData: CreditsPurchasePostRequestOutput;
      pathParams: Record<string, never>;
    }) => {
      logger.error(
        "app.api.v1.core.credits.purchase.error",
        parseError(data.error),
      );
      // Toast is handled by useEndpoint's alert system
    },
    [logger],
  );

  return useEndpoint(
    purchaseDefinitions,
    {
      create: {
        formOptions: {
          persistForm: false,
          defaultValues: {
            quantity: 1,
          },
        },
        mutationOptions: {
          onSuccess: handlePurchaseSuccess,
          onError: handlePurchaseError,
        },
      },
    },
    logger,
  );
}
