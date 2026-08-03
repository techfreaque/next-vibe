/**
 * Skill Vote Repository
 * Directional voting (up/down) with net-score recompute and trust_level
 * auto-upgrade. Re-voting the same direction clears the vote (toggle off);
 * voting the opposite direction flips it.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";

import { SKILL_VERIFIED_VOTE_THRESHOLD } from "../../constants";
import { customSkills, skillVotes } from "../../db";
import type { SkillVoteDirectionValue } from "../../enum";
import {
  SkillOwnershipType,
  SkillTrustLevel,
  SkillVoteDirection,
} from "../../enum";
import { SkillsRepository } from "../../repository";
import voteDefinitions, {
  type SkillVotePostRequestOutput,
  type SkillVotePostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type SkillVoteDir = typeof SkillVoteDirectionValue;

export class SkillVoteRepository {
  static async vote(
    urlPathParams: { id: string },
    data: SkillVotePostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillVotePostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { id: skillId } = urlPathParams;
      // Normalize the requested direction; default to UP for back-compat.
      const direction: SkillVoteDir =
        data.direction === SkillVoteDirection.DOWN
          ? SkillVoteDirection.DOWN
          : SkillVoteDirection.UP;
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

      // Current vote (if any) for this user on this skill.
      const [existingVote] = await db
        .select({ id: skillVotes.id, direction: skillVotes.direction })
        .from(skillVotes)
        .where(
          and(
            eq(skillVotes.skillId, resolvedId),
            eq(skillVotes.userId, userId),
          ),
        );

      // The user's resulting vote: null when toggled off, else the new direction.
      let userVote: SkillVoteDir | null;

      if (existingVote && existingVote.direction === direction) {
        // Same direction again → remove the vote (toggle off).
        await db
          .delete(skillVotes)
          .where(
            and(
              eq(skillVotes.skillId, resolvedId),
              eq(skillVotes.userId, userId),
            ),
          );
        userVote = null;
      } else if (existingVote) {
        // Opposite direction → flip the existing vote.
        await db
          .update(skillVotes)
          .set({ direction })
          .where(
            and(
              eq(skillVotes.skillId, resolvedId),
              eq(skillVotes.userId, userId),
            ),
          );
        userVote = direction;
      } else {
        // No prior vote → insert.
        await db
          .insert(skillVotes)
          .values({ skillId: resolvedId, userId, direction });
        userVote = direction;
      }

      // Recompute net score from the source of truth: up - down.
      const [tally] = await db
        .select({
          up: sql<number>`count(*) filter (where ${skillVotes.direction} = ${SkillVoteDirection.UP})`,
          down: sql<number>`count(*) filter (where ${skillVotes.direction} = ${SkillVoteDirection.DOWN})`,
        })
        .from(skillVotes)
        .where(eq(skillVotes.skillId, resolvedId));

      const upCount = Number(tally?.up ?? 0);
      const downCount = Number(tally?.down ?? 0);
      const newVoteCount = upCount - downCount;

      // Auto-upgrade trust_level to VERIFIED at threshold (net score).
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

      createEndpointEmitter(voteDefinitions.POST, logger, user, {
        urlPathParams: { id: skill.slug ?? skill.id },
        // Vote metrics are visible to anyone who can view the skill.
        kindOverride: SkillsRepository.emitChannelForOwnership(
          skill.ownershipType,
        ).kind,
      })("skill-voted", {
        responseData: { voteCount: newVoteCount, trustLevel: newTrustLevel },
      });

      return success({
        userVote,
        voteCount: newVoteCount,
        upCount,
        downCount,
        trustLevel: newTrustLevel,
      });
    } catch (error) {
      logger.error("SkillVoteRepository.vote failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
