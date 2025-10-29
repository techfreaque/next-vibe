/**
 * Shared Credit Deduction Utilities
 * Provides a consistent interface for deducting credits across agent features
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import { creditRepository } from "../../credits/repository";
import type { JwtPayloadType } from "../../user/auth/types";

/**
 * Deduct credits for a feature
 * Wrapper around creditRepository.deductCreditsForFeature
 */
export async function deductCredits(params: {
  user: JwtPayloadType;
  cost: number;
  feature: string;
  logger: EndpointLogger;
}): Promise<{ success: boolean; messageId?: string }> {
  return await creditRepository.deductCreditsForFeature(
    params.user,
    params.cost,
    params.feature,
    params.logger,
  );
}
