import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "@/app/api/[locale]/agent/shared/media-generation";
import { STANDARD_MARKUP_PERCENTAGE } from "@/app/api/[locale]/products/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import definitions, {
  type MusicGenerationPostRequestOutput,
} from "../definition";

export async function generateMusicWithUnbottled(params: {
  input: MusicGenerationPostRequestOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  featureLabel: string;
}): Promise<
  ResponseType<{
    audioUrl: string;
    creditCost: number;
    durationSeconds: number;
  }>
> {
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
    data: {
      audioUrl: remoteResult.data.audioUrl,
      creditCost,
      durationSeconds: remoteResult.data.durationSeconds,
    },
  };
}
