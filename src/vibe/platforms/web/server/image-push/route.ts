/**
 * Build & Push Image Route
 * API route for building and pushing the production Docker image
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import imagePushEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: imagePushEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).ImagePushRepository.execute(
        data,
        logger,
        t,
      ),
  },
});
