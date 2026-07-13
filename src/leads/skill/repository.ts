/**
 * Lead Skill Attribution Repository
 * Records first-touch skill attribution for a lead
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
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

      await LeadsRepository.updateLeadSkillId(
        leadId,
        data.skillId,
        false,
        logger,
      );

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to set lead skill attribution", parseError(error));
      return success({ success: false });
    }
  }
}
