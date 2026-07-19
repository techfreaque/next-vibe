/**
 * Image Generation API Route
 * Handles image generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ImageGenerationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, toolExecutionContext }) =>
      ImageGenerationRepository.generateImage(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext,
      ),
    requestDefaults: (ctx) => ImageGenerationRepository.getRequestDefaults(ctx),
  },
});
