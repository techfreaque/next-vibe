/**
 * Credit System Hooks
 * React hooks for credit balance, history, and purchase operations
 */

"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { useToast } from "next-vibe-ui/hooks/use-toast";
import { useCallback, useMemo } from "react";

import { handleCheckoutRedirect } from "@/app/api/[locale]/payment/utils/redirect";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import definitions, { type CreditsGetResponseOutput } from "./definition";
import historyDefinitions from "./history/definition";
import purchaseDefinitions, {
  type CreditsPurchasePostRequestOutput,
  type CreditsPurchasePostResponseOutput,
} from "./purchase/definition";

export interface UseCreditsReturn extends EndpointReturn<typeof definitions> {
  /**
   * Optimistically deduct credits from the balance
   * IMPORTANT: This must match server-side deduction logic in repository.ts
   *
   * Deduction Priority Order:
   * 1. Free credits (includes lead credits) - HIGHEST PRIORITY
   * 2. Expiring credits (subscription)
   * 3. Permanent credits - LOWEST PRIORITY
   *
   * @param creditCost - Number of credits to deduct
   * @param feature - Feature name for logging (e.g., "chat_message", "tts", "stt", "brave_search")
   */
  deductCredits: (creditCost: number, feature: string) => void;

  /**
   * Refetch credits from server to sync with actual state
   */
  refetchCredits: () => void;
}

/**
 * Hook for fetching current user's credit balance with optimistic updates
 * Optimized with 10-second cache to reduce excessive API calls
 *
 * @param logger - Endpoint logger for tracking requests
 * @param initialData - Initial credit data from server, or null if not available (hook disabled when null)
 */
export function useCredits(
  logger: EndpointLogger,
  // Pass null when credits should not be fetched (e.g., unauthenticated users)
  initialData: CreditsGetResponseOutput | null,
): UseCreditsReturn | null {
  // Determine if hook is enabled
  const isEnabled = initialData !== null;

  const endpoint = useEndpoint(
    definitions,
    {
      read: {
        // Pass initial data - this will populate the cache properly
        // When initialData is null, the hook is effectively disabled
        initialData: initialData ?? undefined,
        queryOptions: {
          refetchOnWindowFocus: isEnabled,
          staleTime: 10 * 1000, // 10 seconds cache to prevent excessive refetching
          enabled: isEnabled,
        },
      },
    },
    logger,
  );

  /**
   * Deduct credits optimistically following the correct priority order
   */
  const deductCredits = useCallback(
    (creditCost: number) => {
      if (creditCost <= 0) {
        return;
      }

      apiClient.updateEndpointData(definitions.GET, logger, (oldData) => {
        if (!oldData?.success) {
          return oldData;
        }

        const data = oldData.data;

        // Ensure we don't go negative
        if (data.total < creditCost) {
          return oldData;
        }

        // Deduct credits in the correct order: free → expiring → permanent → earned
        let remaining = creditCost;
        let newFree = data.free;
        let newExpiring = data.expiring;
        let newPermanent = data.permanent;
        let newEarned = data.earned;

        // Step 1: Deduct from free credits first (includes lead credits)
        if (remaining > 0 && newFree > 0) {
          const deduction = Math.min(newFree, remaining);
          newFree -= deduction;
          remaining -= deduction;
        }

        // Step 2: Deduct from expiring credits (subscription)
        if (remaining > 0 && newExpiring > 0) {
          const deduction = Math.min(newExpiring, remaining);
          newExpiring -= deduction;
          remaining -= deduction;
        }

        // Step 3: Deduct from permanent credits
        if (remaining > 0 && newPermanent > 0) {
          const deduction = Math.min(newPermanent, remaining);
          newPermanent -= deduction;
          remaining -= deduction;
        }

        // Step 4: Deduct from earned credits (lowest priority)
        if (remaining > 0 && newEarned > 0) {
          const deduction = Math.min(newEarned, remaining);
          newEarned -= deduction;
          remaining -= deduction;
        }

        const newTotal = newFree + newExpiring + newPermanent + newEarned;

        return {
          success: true,
          data: {
            total: newTotal,
            expiring: newExpiring,
            permanent: newPermanent,
            earned: newEarned,
            free: newFree,
            expiresAt: data.expiresAt,
          },
        };
      });
    },
    [logger],
  );

  /**
   * Refetch credits from server
   */
  const refetchCredits = useCallback(async () => {
    if (!endpoint.read?.refetch) {
      logger.warn("Credits refetch not available");
      return;
    }
    await endpoint.read.refetch();
  }, [endpoint.read, logger]);

  const result = useMemo(
    () => ({
      ...endpoint,
      deductCredits,
      refetchCredits,
    }),
    [endpoint, deductCredits, refetchCredits],
  );

  // Return null when disabled (no initial data provided) - after all hooks are called
  if (!isEnabled) {
    return null;
  }

  return result;
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
    (data: {
      requestData: CreditsPurchasePostRequestOutput;
      pathParams: Record<string, never>;
      responseData: CreditsPurchasePostResponseOutput;
    }) => {
      try {
        logger.debug("app.api.credits.purchase.onSuccess.start");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData },
          (errorMessage) => {
            logger.error("app.api.credits.purchase.redirect.failed", {
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
          logger.error("app.api.credits.purchase.redirect.failed");
        }
      } catch (error) {
        logger.error(
          "app.api.credits.purchase.process.failed",
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
    (data: {
      error: ErrorResponseType;
      requestData: CreditsPurchasePostRequestOutput;
      pathParams: Record<string, never>;
    }) => {
      logger.error("app.api.credits.purchase.error", parseError(data.error));
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
