/**
 * Music Generation API Route
 * Handles music generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { keepsExplicitMediaModel } from "../shared/media-generation";
import endpoints from "./definition";
import { MusicGenerationRepository } from "./repository";

/**
 * Export endpoint handlers
 */
export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({
      data,
      user,
      locale,
      logger,
      t,
      toolExecutionContext,
      platform,
    }) =>
      MusicGenerationRepository.generateMusic(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext,
        platform,
      ),
    // A human's explicit model pick wins; AI/MCP callers get the favorite's.
    requestDefaults: (ctx, { requestData }) =>
      keepsExplicitMediaModel(ctx.platform, requestData.model)
        ? {}
        : MusicGenerationRepository.getRequestDefaults(ctx),
  },
});
