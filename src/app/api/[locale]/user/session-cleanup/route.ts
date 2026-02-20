/**
 * Session Cleanup Route Handler
 * Called by cron to clean up expired sessions and tokens
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { sessionCleanupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      sessionCleanupRepository.executeSessionCleanup(data, logger),
  },
});
