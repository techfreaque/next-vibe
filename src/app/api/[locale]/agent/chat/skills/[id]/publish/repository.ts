/**
 * Skill Publish Repository
 * One-click publish/unpublish for custom skills
 */

import "server-only";

import { eq } from "drizzle-orm";
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
import type { CountryLanguage } from "@/i18n/core/config";

import { customSkills } from "../../db";
import type { SkillStatusValue } from "../../enum";
import { SkillOwnershipType, SkillStatus } from "../../enum";
import type { SkillPublishPatchResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class SkillPublishRepository {
  static async publish(
    urlPathParams: { id: string },
    data: { status: typeof SkillStatusValue; changeNote?: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillPublishPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { id: skillId } = urlPathParams;
      if (!user.id) {
        return fail({
          message: t("patch.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Fetch the skill - must belong to caller
      const [skill] = await db
        .select({
          id: customSkills.id,
          userId: customSkills.userId,
          ownershipType: customSkills.ownershipType,
          status: customSkills.status,
          publishedAt: customSkills.publishedAt,
        })
        .from(customSkills)
        .where(eq(customSkills.id, skillId));

      if (!skill) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only the owner can publish
      if (skill.userId !== user.id) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // System skills cannot be published via this endpoint
      if (skill.ownershipType === SkillOwnershipType.SYSTEM) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const newStatus = data.status;
      const isPublishing =
        newStatus === SkillStatus.PUBLISHED &&
        skill.status !== SkillStatus.PUBLISHED;
      const publishedAt = isPublishing
        ? new Date()
        : newStatus !== SkillStatus.PUBLISHED
          ? null
          : skill.publishedAt;

      await db
        .update(customSkills)
        .set({
          status: newStatus,
          ownershipType:
            newStatus === SkillStatus.PUBLISHED
              ? SkillOwnershipType.PUBLIC
              : SkillOwnershipType.USER,
          publishedAt,
          changeNote: data.changeNote ?? null,
          updatedAt: new Date(),
        })
        .where(eq(customSkills.id, skillId));

      return success({
        status_response: newStatus,
        publishedAt: publishedAt?.toISOString() ?? null,
      });
    } catch (error) {
      logger.error("SkillPublishRepository.publish failed", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
