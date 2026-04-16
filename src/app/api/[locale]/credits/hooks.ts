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
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { configScopedTranslation } from "@/config/i18n";
import { useTranslation } from "@/i18n/core/client";

import definitions, { type CreditsGetResponseOutput } from "./definition";
import historyDefinitions from "./history/definition";
import purchaseDefinitions, {
  type CreditsPurchasePostRequestOutput,
  type CreditsPurchasePostResponseOutput,
} from "./purchase/definition";

export interface UseCreditsReturn extends EndpointReturn<typeof definitions> {
  /**
   * Refetch credits from server to sync with actual state
   */
  refetchCredits: () => void;
}

/**
 * Hook for fetching current user's credit balance with optimistic updates
 * Optimized with 10-second cache to reduce excessive API calls
 *
 * @param user - JWT payload for the current user
 * @param logger - Endpoint logger for tracking requests
 * @param initialData - Initial credit data from server, or null if not available (hook disabled when null)
 */
export function useCredits(
  user: JwtPayloadType,
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
      subscribeToEvents: isEnabled,
    },
    logger,
    user,
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
      refetchCredits,
    }),
    [endpoint, refetchCredits],
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
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof historyDefinitions> {
  return useEndpoint(
    historyDefinitions,
    {
      read: {
        initialState: { targetUserId: undefined, targetLeadId: undefined },
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000, // 30 seconds
        },
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for purchasing credit packs
 * Provides full endpoint interface with form controls and automatic Stripe redirect
 */
export function useCreditPurchase(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof purchaseDefinitions> {
  const { toast } = useToast();
  const { locale } = useTranslation();
  const { t } = configScopedTranslation.scopedT(locale);

  // Success callback for credit purchase
  const handlePurchaseSuccess = useCallback(
    (data: {
      requestData: CreditsPurchasePostRequestOutput;
      pathParams: undefined;
      responseData: CreditsPurchasePostResponseOutput;
    }) => {
      try {
        logger.debug("Credits purchase success callback triggered");

        // Handle redirect to Stripe checkout
        const redirected = handleCheckoutRedirect(
          { success: true, data: data.responseData },
          (errorMessage) => {
            logger.error("Credits purchase Stripe redirect failed", {
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
          logger.error("Credits purchase Stripe redirect returned false");
        }
      } catch (error) {
        logger.error("Credits purchase processing failed", parseError(error));
        toast({
          title: t("error.title"),
          description: t("error.description"),
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
      pathParams: undefined;
    }) => {
      logger.error("Credits purchase endpoint error", parseError(data.error));
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
    user,
  );
}
