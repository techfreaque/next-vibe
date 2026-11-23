import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { runEndpointAsSystemProvider } from "next-vibe/execute-tool/repository/run-endpoint-remote";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import { ApiProvider, roundMediaCost } from "../../models/models";
import {
  checkMediaBalance,
  deductMediaCredits,
} from "../../shared/media-generation";
import definitions, {
  type MusicGenerationPostRequestOutput,
} from "../definition";
import type { MusicGenModelId } from "../models";

export async function generateMusicWithUnbottled(params: {
  input: MusicGenerationPostRequestOutput;
  modelId: MusicGenModelId;
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
  /** Ledger feature id (endpoint alias), translated when shown. */
  creditFeature: string;
  toolExecutionContext: ToolExecutionContext;
  platform: Platform;
}): Promise<
  ResponseType<{
    audioUrl: string;
    creditCost: number;
    durationSeconds: number;
  }>
> {
  const {
    input,
    modelId,
    user,
    logger,
    locale,
    creditFeature,
    toolExecutionContext,
    platform,
  } = params;

  const remoteResult = await runEndpointAsSystemProvider({
    definition: definitions.POST,
    input,
    user,
    locale,
    logger,
    toolExecutionContext,
    platform,
  });

  if (!remoteResult.success) {
    return remoteResult;
  }

  const remoteCreditCost = remoteResult.data.creditCost ?? 0;
  // Rounded UP to 0.1 credit (never under-bills).
  const creditCost = roundMediaCost(
    remoteCreditCost * (1 + STANDARD_MARKUP_PERCENTAGE),
  );

  const balanceCheck = await checkMediaBalance(
    user,
    creditCost,
    locale,
    logger,
    modelId,
  );
  if (!balanceCheck.success) {
    return balanceCheck;
  }

  const deductResult = await deductMediaCredits(
    user,
    creditCost,
    creditFeature,
    locale,
    logger,
    balanceCheck.data.tCredits,
    { modelId, apiProvider: ApiProvider.UNBOTTLED },
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
