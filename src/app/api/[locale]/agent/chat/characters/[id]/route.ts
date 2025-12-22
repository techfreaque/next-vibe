/**
 * Single Character API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single character
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CharactersRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      CharactersRepository.getCharacterById(urlPathParams, user, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      CharactersRepository.updateCharacter(data, urlPathParams, user, logger),
  },
});
