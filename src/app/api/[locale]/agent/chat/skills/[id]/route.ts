/**
 * Single Skill API Route Handler
 * Handles GET, PATCH (update), and DELETE requests for a single skill
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { parseSkillId } from "../../slugify";
import { DEFAULT_SKILLS } from "../config";
import { SkillOwnershipType } from "../enum";
import { SkillsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.getSkillById(urlPathParams, user, logger, locale),
    canSubscribe: async ({ user, urlPathParams }) => {
      const raw = urlPathParams["id"];
      if (!raw) {
        return false;
      }

      const { skillId } = parseSkillId(raw);

      if (DEFAULT_SKILLS.some((s) => s.id === skillId)) {
        return true;
      }
      const { eq } = await import("drizzle-orm");
      const { db } = await import("@/app/api/[locale]/system/db");
      const { customSkills } =
        await import("@/app/api/[locale]/agent/chat/skills/db");

      const [skill] = await db
        .select({
          userId: customSkills.userId,
          ownershipType: customSkills.ownershipType,
        })
        .from(customSkills)
        .where(eq(customSkills.slug, skillId))
        .limit(1);
      if (!skill) {
        return false;
      }
      const userId = user.isPublic ? null : user.id;
      return (
        skill.ownershipType === SkillOwnershipType.PUBLIC ||
        skill.userId === userId
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      SkillsRepository.updateSkill(data, urlPathParams, user, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      SkillsRepository.deleteSkill(urlPathParams, user, logger, locale),
  },
});
