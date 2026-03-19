/**
 * Generate TanStack Routes Route
 * API route for generating TanStack Router route files from Next.js pages
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import generateEndpoints from "./definition";
import { GenerateTanstackRoutesRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: ({ user, t }) => {
      return GenerateTanstackRoutesRepository.generate(user, t);
    },
  },
});
