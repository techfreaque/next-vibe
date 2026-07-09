import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { SkillsRepository } from "../repository";
import createSkillDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createSkillDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, streamContext }) =>
      SkillsRepository.createSkill(data, user, logger, t, streamContext),
    onRemoteEvent: {
      "skill-created": (props) =>
        SkillsRepository.applyRemoteSkillCreate(props),
    },
  },
});
