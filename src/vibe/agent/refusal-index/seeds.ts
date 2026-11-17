/**
 * Refusal Index Seeds
 * Inserts the curated initial question set (question-set.ts) by slug.
 * Idempotent and non-destructive: existing slugs are never overwritten, so
 * admin edits and deactivations survive every restart. The one exception is
 * a missing translation (e.g. text_fr, added after the first seed): it is
 * filled in, never replaced. Runs on dev and prod; tests seed their own
 * questions.
 */

import { isNull, or, sql } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { invalidateRefusalIndexCaches } from "./cache";
import { refusalIndexQuestions } from "./db";
import { REFUSAL_INDEX_QUESTION_SET } from "./question-set";

export const priority = 10;

async function seedQuestionSet(logger: EndpointLogger): Promise<void> {
  try {
    const inserted = await db
      .insert(refusalIndexQuestions)
      .values(
        REFUSAL_INDEX_QUESTION_SET.map((question) => ({
          slug: question.slug,
          category: question.category,
          textEn: question.textEn,
          textDe: question.textDe,
          textPl: question.textPl,
          textFr: question.textFr,
        })),
      )
      .onConflictDoUpdate({
        target: refusalIndexQuestions.slug,
        // Fill missing translations only; admin-edited text is never replaced.
        set: {
          textDe: sql`COALESCE(${refusalIndexQuestions.textDe}, excluded.text_de)`,
          textPl: sql`COALESCE(${refusalIndexQuestions.textPl}, excluded.text_pl)`,
          textFr: sql`COALESCE(${refusalIndexQuestions.textFr}, excluded.text_fr)`,
        },
        setWhere: or(
          isNull(refusalIndexQuestions.textDe),
          isNull(refusalIndexQuestions.textPl),
          isNull(refusalIndexQuestions.textFr),
        ),
      })
      .returning({ id: refusalIndexQuestions.id });

    if (inserted.length > 0) {
      invalidateRefusalIndexCaches();
    }
    logger.debug("Refusal Index question set seeded", {
      insertedOrFilled: inserted.length,
      total: REFUSAL_INDEX_QUESTION_SET.length,
    });
  } catch (error) {
    logger.error("Failed to seed Refusal Index questions", parseError(error));
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await seedQuestionSet(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await seedQuestionSet(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("Refusal Index: tests seed their own questions");
}
