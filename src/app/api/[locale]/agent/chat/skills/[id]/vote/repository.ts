/**
 * Skill Vote Repository
 * Toggle-upvote logic with trust_level auto-upgrade
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/endpoint-emitter";
import type { CountryLanguage } from "@/i18n/core/config";

import { SKILL_VERIFIED_VOTE_THRESHOLD } from "../../constants";
import { customSkills, skillVotes } from "../../db";
import { SkillOwnershipType, SkillTrustLevel } from "../../enum";
import { SkillsRepository } from "../../repository";
import skillsDefinitions from "../../definition";
import type { SkillVotePostResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class SkillVoteRepository {
  static async toggleVote(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillVotePostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { id: skillId } = urlPathParams;
      const userId = user.id;
      if (!userId) {
        return fail({
          message: t("post.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Fetch the skill - must exist and be a published custom skill
      // Resolve by UUID or slug
      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [skill] = await db
        .select({
          id: customSkills.id,
          slug: customSkills.slug,
          ownershipType: customSkills.ownershipType,
          voteCount: customSkills.voteCount,
          trustLevel: customSkills.trustLevel,
        })
        .from(customSkills)
        .where(idCondition);

      if (!skill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Use resolved UUID for all FK operations
      const resolvedId = skill.id;

      // Only community/public skills can be voted on
      if (skill.ownershipType === SkillOwnershipType.SYSTEM) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check if user already voted
      const [existingVote] = await db
        .select({ id: skillVotes.id })
        .from(skillVotes)
        .where(
          and(
            eq(skillVotes.skillId, resolvedId),
            eq(skillVotes.userId, userId),
          ),
        );

      let voted: boolean;
      let newVoteCount: number;

      if (existingVote) {
        // Remove vote
        await db
          .delete(skillVotes)
          .where(
            and(
              eq(skillVotes.skillId, resolvedId),
              eq(skillVotes.userId, userId),
            ),
          );
        newVoteCount = Math.max(0, skill.voteCount - 1);
        voted = false;
      } else {
        // Add vote
        await db.insert(skillVotes).values({ skillId: resolvedId, userId });
        newVoteCount = skill.voteCount + 1;
        voted = true;
      }

      // Auto-upgrade trust_level to VERIFIED at threshold
      const newTrustLevel =
        newVoteCount >= SKILL_VERIFIED_VOTE_THRESHOLD
          ? SkillTrustLevel.VERIFIED
          : SkillTrustLevel.COMMUNITY;

      await db
        .update(customSkills)
        .set({
          voteCount: newVoteCount,
          trustLevel: newTrustLevel,
          updatedAt: new Date(),
        })
        .where(eq(customSkills.id, resolvedId));

      // Emit WS event so all open tabs see updated vote count immediately
      const emitSkills = createEndpointEmitter(
        skillsDefinitions.GET,
        logger,
        user,
      );
      emitSkills("skill-updated", {
        wsEvent: {
          type: "updated",
          skillId: skill.slug ?? skill.id,
          voteCount: newVoteCount,
          trustLevel: newTrustLevel,
        },
      });

      return success({
        voted,
        voteCount: newVoteCount,
        trustLevel: newTrustLevel,
      });
    } catch (error) {
      logger.error("SkillVoteRepository.toggleVote failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
