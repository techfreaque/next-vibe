/**
 * Lead Skill Attribution Repository
 * Records first-touch skill attribution for a lead
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { LeadsRepository } from "../repository";
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
