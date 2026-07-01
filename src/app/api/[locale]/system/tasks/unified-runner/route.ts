/**
 * Unified Task Runner Route
 * Handles unified task runner management operations
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { UnifiedTaskRunnerRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      UnifiedTaskRunnerRepository.manageRunner(
        data,
        user,
        locale,
        logger,
        true,
      ),
  },
});
