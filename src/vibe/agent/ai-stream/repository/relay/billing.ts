import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CREDIT_VALUE_USD } from "@/products/constants";

import { chargeForProviderCredits } from "../../../models/models";
import type { ChatModelId } from "../../models";

/** Return the caller's settled charge for all upstream steps, including its markup. */
export async function settleInferenceRelay(params: {
  user: JwtPayloadType;
  model: ChatModelId;
  providerCredits: number;
  listedCost: number;
  instanceId: string;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<number> {
  const {
    user,
    model,
    providerCredits,
    listedCost,
    instanceId,
    logger,
    locale,
  } = params;
  const charge =
    providerCredits > 0
      ? chargeForProviderCredits(providerCredits)
      : listedCost;
  if (charge <= 0) {
    return 0;
  }
  if (providerCredits <= 0) {
    logger.warn(
      "[Relay] Provider reported no charge - billing listed estimate",
      {
        model,
        originatorModelCost: listedCost,
      },
    );
  }
  try {
    const { CreditRepository } = await import("@/credits/repository");
    const { scopedTranslation } = await import("@/credits/i18n");
    const result = await CreditRepository.deductCreditsForModelUsage(
      user,
      charge,
      model,
      logger,
      scopedTranslation.scopedT(locale).t,
      locale,
      providerCredits > 0
        ? {
            upstreamCostUsd: providerCredits * CREDIT_VALUE_USD,
            fallbackCostUsd: 0,
            upstreamProvider: instanceId,
            billingBasis: "upstream_cost",
          }
        : undefined,
    );
    if (result.success) {
      return result.data.deducted ?? charge;
    }
    logger.error("[Relay] Originator inference-provider deduction failed", {
      errorType: result.errorType.errorKey,
    });
  } catch (error) {
    logger.error("[Relay] Originator inference-provider deduction failed", {
      error: parseError(error).message,
    });
  }
  return 0;
}
