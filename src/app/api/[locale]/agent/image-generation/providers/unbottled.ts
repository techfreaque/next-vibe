import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "@/app/api/[locale]/agent/shared/media-generation";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import definitions, {
  type ImageGenerationPostRequestOutput,
} from "../definition";

export async function generateImageWithUnbottled(params: {
  input: ImageGenerationPostRequestOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  featureLabel: string;
}): Promise<ResponseType<{ imageUrl: string; creditCost: number }>> {
  const { input, user, logger, locale, featureLabel } = params;

  const remoteResult = await RouteExecuteRepository.runAsSystemProvider({
    definition: definitions.POST,
    input,
    user,
    locale,
    logger,
  });

  if (!remoteResult.success) {
    return remoteResult;
  }

  const remoteCreditCost = remoteResult.data.creditCost ?? 0;
  const creditCost =
    Math.round(remoteCreditCost * (1 + STANDARD_MARKUP_PERCENTAGE) * 10) / 10;

  const balanceCheck = await checkMediaBalance(
    user,
    creditCost,
    locale,
    logger,
  );
  if (!balanceCheck.success) {
    return balanceCheck;
  }

  const deductResult = await deductMediaCredits(
    user,
    creditCost,
    featureLabel,
    locale,
    logger,
    balanceCheck.data.tCredits,
  );
  if (!deductResult.success) {
    return deductResult;
  }

  return {
    success: true,
    data: { imageUrl: remoteResult.data.imageUrl, creditCost },
  };
}
