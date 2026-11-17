/**
 * After a tier change: the plan moved and (on upgrade) the balance grew.
 * Refetch both so every open surface shows the new tier and credits.
 */

import type { EndpointLogger } from "next-vibe/logger/types";

export async function refreshAfterTierChange(
  logger: EndpointLogger,
): Promise<void> {
  const { apiClient } = await import("next-vibe/unified-ui/hooks/store");
  const subscriptionDefinition = await import("../definition");
  const creditsDefinition = await import("@/credits/definition");
  await Promise.all([
    apiClient.refetchEndpoint(subscriptionDefinition.default.GET, logger),
    apiClient.refetchEndpoint(creditsDefinition.default.GET, logger),
  ]);
}
