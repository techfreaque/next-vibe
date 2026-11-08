/**
 * Refusal Index - Questions Repository
 * Admin CRUD over the curated question set. Pure data: nothing is seeded.
 */

import "server-only";

import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { invalidateRefusalIndexCaches } from "../cache";
import { refusalIndexQuestions, refusalIndexResults } from "../db";
import { scopedTranslation } from "../i18n";
import type {
  QuestionsGetRequestOutput,
  QuestionsGetResponseOutput,
  QuestionsPostRequestOutput,
  QuestionsPostResponseOutput,
} from "./definition";
import type {
  QuestionDeleteResponseOutput,
  QuestionPatchRequestOutput,
  QuestionPatchResponseOutput,
} from "./[id]/definition";

function emptyToNull(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export class RefusalQuestionsRepository {
  static async list(
    data: QuestionsGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<QuestionsGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const conditions = [];
      if (data.status === "active") {
        conditions.push(eq(refusalIndexQuestions.active, true));
      } else if (data.status === "inactive") {
        conditions.push(eq(refusalIndexQuestions.active, false));
      }
      if (data.category && data.category.trim() !== "") {
        conditions.push(
          ilike(refusalIndexQuestions.category, data.category.trim()),
        );
      }
      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(refusalIndexQuestions)
        .where(where)
        .orderBy(
          asc(refusalIndexQuestions.category),
          desc(refusalIndexQuestions.createdAt),
        )
        .limit(data.limit)
        .offset(data.offset);
      const [totalRow] = await db
        .select({ value: count() })
        .from(refusalIndexQuestions)
        .where(where);
      const categoryRows = await db
        .select({
          category: refusalIndexQuestions.category,
          count: count(),
        })
        .from(refusalIndexQuestions)
        .groupBy(refusalIndexQuestions.category)
        .orderBy(asc(refusalIndexQuestions.category));

      return success({
        questions: rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          category: row.category,
          textEn: row.textEn,
          textDe: row.textDe,
          textPl: row.textPl,
          active: row.active,
        })),
        categories: categoryRows,
        total: totalRow?.value ?? 0,
      });
    } catch (error) {
      logger.error("RefusalQuestionsRepository.list failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async create(
    data: QuestionsPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<QuestionsPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [existing] = await db
        .select({ id: refusalIndexQuestions.id })
        .from(refusalIndexQuestions)
        .where(eq(refusalIndexQuestions.slug, data.slug))
        .limit(1);
      if (existing) {
        return fail({
          message: t("messages.slugTaken", { slug: data.slug }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const [row] = await db
        .insert(refusalIndexQuestions)
        .values({
          slug: data.slug,
          category: data.category.trim().toLowerCase(),
          textEn: data.textEn.trim(),
          textDe: emptyToNull(data.textDe) ?? null,
          textPl: emptyToNull(data.textPl) ?? null,
          active: data.active,
        })
        .returning({ id: refusalIndexQuestions.id });
      if (!row) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return success({ id: row.id });
    } catch (error) {
      logger.error(
        "RefusalQuestionsRepository.create failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async update(
    urlPathParams: { id: string },
    data: QuestionPatchRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<QuestionPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const textDe = emptyToNull(data.textDe);
      const textPl = emptyToNull(data.textPl);
      const [row] = await db
        .update(refusalIndexQuestions)
        .set({
          ...(data.category !== undefined
            ? { category: data.category.trim().toLowerCase() }
            : {}),
          ...(data.active !== undefined ? { active: data.active } : {}),
          ...(data.textEn !== undefined ? { textEn: data.textEn.trim() } : {}),
          ...(textDe !== undefined ? { textDe } : {}),
          ...(textPl !== undefined ? { textPl } : {}),
          updatedAt: sql`now()`,
        })
        .where(eq(refusalIndexQuestions.id, urlPathParams.id))
        .returning({ id: refusalIndexQuestions.id });
      if (!row) {
        return fail({
          message: t("messages.questionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      invalidateRefusalIndexCaches();
      return success({ updatedId: row.id });
    } catch (error) {
      logger.error(
        "RefusalQuestionsRepository.update failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Delete only questions never used in a run; used ones are deactivated instead. */
  static async remove(
    urlPathParams: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<QuestionDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [used] = await db
        .select({ value: count() })
        .from(refusalIndexResults)
        .where(eq(refusalIndexResults.questionId, urlPathParams.id));
      if ((used?.value ?? 0) > 0) {
        return fail({
          message: t("messages.questionInUse"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const deleted = await db
        .delete(refusalIndexQuestions)
        .where(eq(refusalIndexQuestions.id, urlPathParams.id))
        .returning({ id: refusalIndexQuestions.id });
      if (deleted.length === 0) {
        return fail({
          message: t("messages.questionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success({ deleted: true });
    } catch (error) {
      logger.error(
        "RefusalQuestionsRepository.remove failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
