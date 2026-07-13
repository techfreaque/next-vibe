/**
 * Skill Report Repository
 * Submit report with auto-hide on threshold
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import { SKILL_AUTO_HIDE_REPORT_THRESHOLD } from "../../constants";
import { customSkills, skillReports } from "../../db";
import { SkillOwnershipType, SkillStatus } from "../../enum";
import { SkillsRepository } from "../../repository";
import type { SkillReportPostResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class SkillReportRepository {
  static async submitReport(
    urlPathParams: { id: string },
    data: { reason: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillReportPostResponseOutput>> {
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

      // Fetch the skill - resolve by UUID or slug
      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [skill] = await db
        .select({
          id: customSkills.id,
          ownershipType: customSkills.ownershipType,
          reportCount: customSkills.reportCount,
          status: customSkills.status,
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

      // System skills cannot be reported
      if (skill.ownershipType === SkillOwnershipType.SYSTEM) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check for existing report (idempotent - one per user per skill)
      const [existingReport] = await db
        .select({ id: skillReports.id })
        .from(skillReports)
        .where(
          and(
            eq(skillReports.skillId, resolvedId),
            eq(skillReports.userId, userId),
          ),
        );

      if (existingReport) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Insert report
      await db
        .insert(skillReports)
        .values({ skillId: resolvedId, userId, reason: data.reason });

      const newReportCount = skill.reportCount + 1;
      const shouldAutoHide =
        newReportCount >= SKILL_AUTO_HIDE_REPORT_THRESHOLD &&
        skill.status !== SkillStatus.UNLISTED;

      if (shouldAutoHide) {
        logger.warn(
          `Skill ${skillId} auto-hidden: report_count=${newReportCount}`,
        );
      }

      await db
        .update(customSkills)
        .set({
          reportCount: newReportCount,
          ...(shouldAutoHide ? { status: SkillStatus.UNLISTED } : {}),
          updatedAt: new Date(),
        })
        .where(eq(customSkills.id, resolvedId));

      return success({
        reported: true,
        reportCount: newReportCount,
      });
    } catch (error) {
      logger.error(
        "SkillReportRepository.submitReport failed",
        parseError(error),
      );
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
