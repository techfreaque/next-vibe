/**
 * Rebuild & Restart Route
 * API route for rebuilding and hot-restarting the server
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import rebuildEndpoints from "./definition";
import { RebuildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: rebuildEndpoints,
  [Methods.POST]: {
    handler: ({ locale, logger, t, streamContext }) => {
      return RebuildRepository.execute(
        locale,
        logger,
        t,
        streamContext.abortSignal,
      );
    },
  },
});
