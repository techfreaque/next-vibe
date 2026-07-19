import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Lead Skill Attribution Route Handler
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { LeadSkillRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ data, user, logger }) =>
      LeadSkillRepository.setAttribute(data, user, logger),
  },
});
