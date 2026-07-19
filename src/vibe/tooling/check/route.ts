/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import vibeCheckEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: async ({
      data,
      logger,
      platform,
      t,
      locale,
      toolExecutionContext,
    }) =>
      (await import("./repository/repository")).VibeCheckRepository.execute(
        data,
        logger,
        platform,
        t,
        locale,
        toolExecutionContext.abortSignal,
      ),
  },
});
