/**
 * Characters API Route Handler
 * Handles GET (list) requests for characters
 * POST (create) is handled in ./create/route.ts
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CharactersRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      CharactersRepository.getCharacters(user, logger),
  },
});
