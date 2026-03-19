/**
 * Skill Moderation Repository
 * Admin-only: list reported skills, hide or clear reports
 */

import "server-only";

import { desc, eq, gte } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { customSkills } from "../db";
import { SkillStatus } from "../enum";
import type {
  SkillModerationGetResponseOutput,
  SkillModerationPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class SkillModerationRepository {
  static async listReported(
    data: { minReports?: number; limit?: number; offset?: number },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillModerationGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const minReports = data.minReports ?? 1;
      const limit = data.limit ?? 50;
      const offset = data.offset ?? 0;

      const rows = await db
        .select({
          id: customSkills.id,
          name: customSkills.name,
          userId: customSkills.userId,
          status: customSkills.status,
          reportCount: customSkills.reportCount,
          voteCount: customSkills.voteCount,
          trustLevel: customSkills.trustLevel,
          publishedAt: customSkills.publishedAt,
          updatedAt: customSkills.updatedAt,
        })
        .from(customSkills)
        .where(gte(customSkills.reportCount, minReports))
        .orderBy(desc(customSkills.reportCount))
        .limit(limit)
        .offset(offset);

      const skills = rows.map((row) => ({
        id: row.id,
        name: row.name,
        ownerAuthorId: row.userId,
        status: row.status ?? null,
        reportCount: row.reportCount,
        voteCount: row.voteCount,
        trustLevel: row.trustLevel ?? null,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
      }));

      return success({ skills, totalCount: skills.length });
    } catch (error) {
      logger.error(
        "SkillModerationRepository.listReported failed",
        parseError(error),
      );
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async moderate(
    data: { id: string; action: "hide" | "clear" },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillModerationPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [skill] = await db
        .select({
          id: customSkills.id,
          status: customSkills.status,
          reportCount: customSkills.reportCount,
        })
        .from(customSkills)
        .where(eq(customSkills.id, data.id));

      if (!skill) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updates =
        data.action === "hide"
          ? { status: SkillStatus.UNLISTED, updatedAt: new Date() }
          : { reportCount: 0, updatedAt: new Date() };

      await db
        .update(customSkills)
        .set(updates)
        .where(eq(customSkills.id, data.id));

      const newStatus =
        data.action === "hide" ? SkillStatus.UNLISTED : (skill.status ?? null);
      const newReportCount = data.action === "clear" ? 0 : skill.reportCount;

      return success({
        patchId: skill.id,
        patchStatus: newStatus,
        patchReportCount: newReportCount,
      });
    } catch (error) {
      logger.error(
        "SkillModerationRepository.moderate failed",
        parseError(error),
      );
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
