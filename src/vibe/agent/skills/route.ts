/**
 * Skills API Route Handler
 * Handles GET (list) requests for skills
 * POST (create) is handled in ./create/route.ts
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SkillsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale, platform }) =>
      SkillsRepository.getSkills(data, user, logger, locale, platform),
  },
});
