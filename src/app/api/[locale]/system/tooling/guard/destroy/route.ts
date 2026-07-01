/**
 * Guard Destroy Route Handler
 * Handles POST requests for destroying guard environments
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import guardDestroyEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: guardDestroyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).GuardDestroyRepository.destroyGuard(data, logger, t),
  },
});
