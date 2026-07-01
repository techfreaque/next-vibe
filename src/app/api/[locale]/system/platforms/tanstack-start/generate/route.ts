/**
 * Generate TanStack Routes Route
 * API route for generating TanStack Router route files from Next.js pages
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import generateEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: async ({ user, t }) =>
      // Dynamic import keeps repository out of the static module graph so
      // Turbopack's NFT tracer doesn't follow process.cwd() + fs calls here.
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).GenerateTanstackRoutesRepository.generate(user, t),
  },
});
