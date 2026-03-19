/**
 * Skill Report Repository
 * Submit report with auto-hide on threshold
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
import type { CountryLanguage } from "@/i18n/core/config";

import { SKILL_AUTO_HIDE_REPORT_THRESHOLD } from "../../constants";
import { customSkills, skillReports } from "../../db";
import { SkillOwnershipType, SkillStatus } from "../../enum";
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

      // Fetch the skill
      const [skill] = await db
        .select({
          id: customSkills.id,
          ownershipType: customSkills.ownershipType,
          reportCount: customSkills.reportCount,
          status: customSkills.status,
        })
        .from(customSkills)
        .where(eq(customSkills.id, skillId));

      if (!skill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // System skills cannot be reported
      if (skill.ownershipType === SkillOwnershipType.SYSTEM) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check for existing report (idempotent — one per user per skill)
      const [existingReport] = await db
        .select({ id: skillReports.id })
        .from(skillReports)
        .where(
          and(
            eq(skillReports.skillId, skillId),
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
        .values({ skillId, userId, reason: data.reason });

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
        .where(eq(customSkills.id, skillId));

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
