/**
 * Build & Push Image Route
 * API route for building and pushing the production Docker image
 */

import "server-only";

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import imagePushEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: imagePushEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ImagePushRepository.execute(data, logger, t),
  },
});
