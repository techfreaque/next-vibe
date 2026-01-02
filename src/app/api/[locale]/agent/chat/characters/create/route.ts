import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CharactersRepository } from "../repository";
import createCharacterDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createCharacterDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) => CharactersRepository.createCharacter(data, user, logger),
  },
});
