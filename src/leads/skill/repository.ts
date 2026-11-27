/**
 * Lead Skill Attribution Repository
 * Records first-touch skill attribution for a lead
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { isUuid } from "next-vibe/agent/chat/slugify";
import { customSkills } from "next-vibe/agent/skills/db";
import { SkillOwnershipType, SkillStatus } from "next-vibe/agent/skills/enum";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { LeadsRepository } from "next-vibe/identity/lead/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  LeadSkillPatchRequestOutput,
  LeadSkillPatchResponseOutput,
} from "./definition";

export class LeadSkillRepository {
  static async setAttribute(
    data: LeadSkillPatchRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadSkillPatchResponseOutput>> {
    try {
      const leadId = user.leadId;
      if (!leadId) {
        logger.debug("No leadId in JWT - skipping skill attribution");
        return success({ success: false });
      }

      let skillId = data.skillId;
      if (!isUuid(skillId)) {
        const [skill] = await db
          .select({ id: customSkills.id })
          .from(customSkills)
          .where(
            and(
              SkillsRepository.resolveSkillIdCondition(skillId),
              eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
              eq(customSkills.status, SkillStatus.PUBLISHED),
            ),
          )
          .limit(1);
        if (!skill) {
          return success({ success: false });
        }
        skillId = skill.id;
      }

      const attributed = await LeadsRepository.updateLeadSkillId(
        leadId,
        skillId,
        false,
        logger,
      );

      return success({ success: attributed });
    } catch (error) {
      logger.error("Failed to set lead skill attribution", parseError(error));
      return success({ success: false });
    }
  }
}
