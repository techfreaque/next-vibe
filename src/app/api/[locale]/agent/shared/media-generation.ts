/**
 * Shared helpers for media generation endpoints (image, music, video).
 * Centralises the credit check + deduct pattern used by all generation repos.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CreditsT } from "@/app/api/[locale]/credits/i18n";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
    user.isPublic && user.leadId
      ? { leadId: user.leadId }
      : user.id
        ? { userId: user.id, leadId: user.leadId }
        : { leadId: user.leadId! },
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
      message: tCredits("errors.insufficientCredits"),
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
    // eslint-disable-next-line i18next/no-literal-string
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
