/**
 * Generate TanStack Routes Route
 * API route for generating TanStack Router route files from Next.js pages
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: async ({ user, t }) => {
      // Dynamic import keeps repository out of the static module graph so
      // Turbopack's NFT tracer doesn't follow process.cwd() + fs calls here.
      const { GenerateTanstackRoutesRepository } =
        await import(/* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository");
      return GenerateTanstackRoutesRepository.generate(user, t);
    },
  },
});
