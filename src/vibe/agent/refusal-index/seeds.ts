/**
 * Refusal Index Seeds
 * Inserts the curated initial question set (question-set.ts) by slug.
 * Idempotent and non-destructive: existing slugs are never overwritten, so
 * admin edits and deactivations survive every restart. Runs on dev and prod;
 * tests seed their own questions.
 */

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
        })),
      )
      .onConflictDoNothing({ target: refusalIndexQuestions.slug })
      .returning({ id: refusalIndexQuestions.id });

    if (inserted.length > 0) {
      invalidateRefusalIndexCaches();
    }
    logger.debug("Refusal Index question set seeded", {
      inserted: inserted.length,
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
