import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { skillsIndexGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      skillsIndexGeneratorRepository.generateSkillsIndex(data, logger, t),
  },
});
