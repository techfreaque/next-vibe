import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SkillsRepository } from "../repository";
import createSkillDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createSkillDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      SkillsRepository.createSkill(data, user, logger, t),
    onRemoteEvent: {
      "skill-created": (props) =>
        SkillsRepository.applyRemoteSkillCreate(props),
    },
  },
});
