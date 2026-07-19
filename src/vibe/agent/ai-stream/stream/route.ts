/**
 * AI Stream API Route
 * Handles streaming AI chat responses with multi-step tool calling support
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
      toolExecutionContext,
    }) =>
      AiStreamRepository.createAiStream({
        data,
        t,
        locale,
        logger,
        user,
        request,
        subAgentDepth: toolExecutionContext.subAgentDepth,
      }),
  },
});
