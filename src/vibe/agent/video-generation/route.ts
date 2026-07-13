/**
 * Video Generation API Route
 * Handles video generation requests via multiple AI providers
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { VideoGenerationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      VideoGenerationRepository.generateVideo(
        data,
        user,
        locale,
        logger,
        t,
        streamContext,
      ),
    requestDefaults: (ctx) => VideoGenerationRepository.getRequestDefaults(ctx),
  },
});
