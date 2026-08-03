/**
 * Error Logs Cleanup Route Handler
 * Thin wrapper - all logic lives in repository.ts
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

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
