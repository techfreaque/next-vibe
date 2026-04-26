/**
 * AI Stream API Route
 * Handles streaming AI chat responses with multi-step tool calling support
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { AiStreamRepository } from "../repository";
import definitions from "./definition";

/**
 * POST handler for AI streaming
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({
      data,
      t,
      locale,
      logger,
      user,
      request,
      streamContext,
    }) =>
      AiStreamRepository.createAiStream({
        data,
        t,
        locale,
        logger,
        user,
        request,
        subAgentDepth: streamContext.subAgentDepth,
      }),
  },
});
