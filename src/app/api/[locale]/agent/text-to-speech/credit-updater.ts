/**
 * TTS Credit Updater
 * Utilities for updating credit balance after TTS operations
 */

"use client";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import creditsDefinition from "@/app/api/[locale]/credits/definition";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import textToSpeechDefinition from "./definition";

/**
 * Update credit balance after TTS conversion
 * This performs an optimistic update to the credit balance in the UI
 */
export function updateCreditBalanceForTTS(logger: EndpointLogger): void {
  // Get credit cost from definition
  const creditCost = textToSpeechDefinition.POST.credits ?? 0;

  if (creditCost <= 0 || !creditsDefinition.GET) {
    return;
  }

  apiClient.updateEndpointData(creditsDefinition.GET, logger, (oldData) => {
    if (!oldData?.success) {
      return oldData;
    }

    const data = oldData.data as CreditsGetResponseOutput;
    const newTotal = Math.max(0, data.total - creditCost);

    return {
      success: true,
      data: {
        total: newTotal,
        expiring: data.expiring,
        permanent: data.permanent,
        earned: data.earned,
        free: data.free,
        expiresAt: data.expiresAt,
      },
    };
  });

  logger.debug("Credit balance updated in cache after TTS", {
    creditCost,
  });
}
