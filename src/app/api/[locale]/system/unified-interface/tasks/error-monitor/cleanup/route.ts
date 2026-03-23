/**
 * Error Logs Cleanup Route Handler
 * Thin wrapper - all logic lives in repository.ts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ErrorLogsCleanupRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) =>
      await ErrorLogsCleanupRepository.cleanup(logger),
  },
});
