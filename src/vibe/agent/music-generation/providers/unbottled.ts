import "server-only";

import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "next-vibe/agent/shared/media-generation";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import definitions, {
  type MusicGenerationPostRequestOutput,
} from "../definition";

export async function generateMusicWithUnbottled(params: {
  input: MusicGenerationPostRequestOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  featureLabel: string;
  streamContext: ToolExecutionContext;
}): Promise<
  ResponseType<{
    audioUrl: string;
    creditCost: number;
    durationSeconds: number;
  }>
> {
  const { input, user, logger, locale, featureLabel, streamContext } = params;

  const remoteResult = await RouteExecuteRepository.runAsSystemProvider({
    definition: definitions.POST,
    input,
    user,
    locale,
    logger,
    streamContext,
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
