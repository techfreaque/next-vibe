/**
 * Shared helpers for media generation endpoints (image, music, video).
 * Centralises the credit check + deduct pattern used by all generation repos.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import type { CreditsT } from "@/credits/i18n";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

/**
 * Check that the user has sufficient credits for a generation request.
 * Uses the credits scoped translation internally.
 * Returns a fail() if balance check fails or balance is insufficient.
 */
export async function checkMediaBalance(
  user: JwtPayloadType,
  creditCost: number,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<{ tCredits: CreditsT }>> {
  const { t: tCredits } = creditsScopedTranslation.scopedT(locale);

  const balanceResult = await CreditRepository.getBalance(
    user,
    logger,
    tCredits,
    locale,
  );

  if (!balanceResult.success) {
    return fail({
      message: tCredits("errors.getBalanceFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  if (balanceResult.data.total < creditCost) {
    return fail({
      message: tCredits("errors.insufficientCredits", { cost: creditCost }),
      errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
    });
  }

  return success({ tCredits });
}

/**
 * Deduct credits for a generation feature after successful generation.
 * Uses the credits scoped translation internally.
 * Returns a fail() if deduction fails.
 */
export async function deductMediaCredits(
  user: JwtPayloadType,
  creditCost: number,
  feature: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  tCredits: CreditsT,
): Promise<ResponseType<void>> {
  const deductResult = await CreditRepository.deductCreditsForFeature(
    user,
    creditCost,
    feature,
    logger,
    tCredits,
    locale,
  );

  if (!deductResult.success) {
    logger.error("[MediaGen] Failed to deduct credits", {
      creditCost,
      feature,
    });
    return fail({
      message: tCredits("errors.deductCreditsFailed"),
      errorType: ErrorResponseTypes.PAYMENT_ERROR,
    });
  }

  return success(undefined);
}

/**
 * True when the caller's own model pick must survive requestDefaults.
 *
 * requestDefaults patches normally win over the request. For a human picking a
 * model in the web/CLI form the pick is always deliberate, so it is kept - else
 * overriding it silently charged them for a different (often far pricier) model.
 *
 * AI/MCP callers are trickier: they sometimes echo the stale example model id
 * baked into the tool schema, in which case defaults should win. But when the
 * AI passes a REAL, known model id it made a deliberate choice and we must
 * honour it - silently swapping it for the favorite/skill model ignored the
 * caller's explicit pick. So for AI/MCP we keep the pick only when it is a
 * known model id for that media type; an undefined, blank, or unknown
 * placeholder falls through to the favorite/skill default.
 *
 * @param isKnownModel - validates that requestedModel is a real model id for
 *   the calling media type (e.g. backed by getImageGenModelById). Only consulted
 *   for AI/MCP callers.
 */
export function keepsExplicitMediaModel(
  platform: Platform,
  requestedModel: string | undefined,
  isKnownModel: (model: string) => boolean,
): boolean {
  if (requestedModel === undefined || requestedModel === "") {
    return false;
  }
  if (platform !== Platform.AI && platform !== Platform.MCP) {
    return true;
  }
  return isKnownModel(requestedModel);
}
