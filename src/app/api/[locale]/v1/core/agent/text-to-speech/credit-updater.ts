/**
 * TTS Credit Updater
 * Utilities for updating credit balance after TTS operations
 */

"use client";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/v1/core/credits/definition";
import creditsDefinition from "@/app/api/[locale]/v1/core/credits/definition";
import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

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

  // Update the credit balance using the built-in helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const endpoint = creditsDefinition.GET as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiClient.updateEndpointData(endpoint, (oldData: any) => {
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
        free: data.free,
        expiresAt: data.expiresAt,
      },
    };
  });

  logger.debug("Credit balance updated in cache after TTS", {
    creditCost,
  });
}

