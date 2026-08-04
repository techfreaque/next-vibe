/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import vibeCheckEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, user, toolExecutionContext }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */
          "./repository/repository"
        )
      ).VibeCheckRepository.execute(
        data,
        logger,
        platform,
        // `user` binds the progress emitter to the caller's own channel — check
        // results are private, so events ride user/{id} (channel scope "user").
        user,
        toolExecutionContext.abortSignal,
      ),
  },
});
