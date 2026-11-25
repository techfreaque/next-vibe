/**
 * Refusal Index Database Schema
 * Admin-curated question set, benchmark runs, per-(run, question, model)
 * results and the admin-approved public samples.
 */

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import { RefusalRunStatus, RefusalRunStatusDB, RefusalVerdictDB } from "./enum";

/**
 * Questions. The initial curated set is seeded by slug (seeds.ts, never
 * overwritten); the weekly run adds generated ones (generatedBy = the
 * proposing model); admins edit, deactivate and extend it at runtime.
 * Category is a free admin-managed slug (not an enum) so categories are data too.
 */
export const refusalIndexQuestions = pgTable(
  "refusal_index_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    category: text("category").notNull(),
    /** The prompt sent to every model. English is the benchmark language. */
    textEn: text("text_en").notNull(),
    /** Display translations only (public samples). Never sent to models. */
    textDe: text("text_de"),
    textPl: text("text_pl"),
    textFr: text("text_fr"),
    textIt: text("text_it"),
    textEs: text("text_es"),
    textSk: text("text_sk"),
    /** Model that proposed this question. Null = curated by hand. */
    generatedBy: text("generated_by"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("refusal_index_questions_category_idx").on(
      table.category,
    ),
  }),
);

/** One benchmark run. Judge model + prompt version are frozen here for reproducibility. */
export const refusalIndexRuns = pgTable(
  "refusal_index_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    status: text("status", { enum: RefusalRunStatusDB })
      .notNull()
      .default(RefusalRunStatus.RUNNING),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    finishedAt: timestamp("finished_at"),
    /** Liveness stamp - a running run without a recent heartbeat is resumable. */
    heartbeatAt: timestamp("heartbeat_at").notNull().defaultNow(),
    modelCount: integer("model_count").notNull().default(0),
    questionCount: integer("question_count").notNull().default(0),
    /** Credits spent so far (answers + judge). */
    totalCost: doublePrecision("total_cost").notNull().default(0),
    /** Per-run credit cap. Null = uncapped. */
    budgetCredits: doublePrecision("budget_credits"),
    judgeModelId: text("judge_model_id").notNull(),
    judgePromptVersion: text("judge_prompt_version").notNull(),
    runnerPromptVersion: text("runner_prompt_version").notNull(),
    /** Pairs that still needed an answer when the run was planned. */
    pairCount: integer("pair_count").notNull().default(0),
    /** New questions this run asked the generator for / actually added. */
    questionsRequested: integer("questions_requested").notNull().default(0),
    questionsGenerated: integer("questions_generated").notNull().default(0),
    /** Optional scope filters (null = all current models / active questions). */
    modelFilter: jsonb("model_filter").$type<string[] | null>(),
    questionFilter: jsonb("question_filter").$type<string[] | null>(),
    startedByUserId: uuid("started_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("refusal_index_runs_status_idx").on(
      table.status,
      table.startedAt,
    ),
  }),
);

/**
 * Verdict for one model answering one question. Answers are permanent: a
 * pair is asked once and never again, unless the model's version changes
 * (then the old row gets staleAt and a new row is added). Exactly one current
 * (staleAt null) row per (question, model). runId = the run that produced it.
 */
export const refusalIndexResults = pgTable(
  "refusal_index_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => refusalIndexRuns.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => refusalIndexQuestions.id, { onDelete: "cascade" }),
    modelId: text("model_id").notNull(),
    /** Model version fingerprint at answer time (models.ts modelVersionOf). */
    modelVersion: text("model_version").notNull().default(""),
    /** Set when a newer model version replaced this answer. */
    staleAt: timestamp("stale_at"),
    verdict: text("verdict", { enum: RefusalVerdictDB }).notNull(),
    /** One-line judge reason (or the error / content-filter note). */
    judgeReason: text("judge_reason").notNull().default(""),
    /** Truncated answer. */
    answerExcerpt: text("answer_excerpt").notNull().default(""),
    latencyMs: integer("latency_ms").notNull().default(0),
    /** Credits for answer + judge. */
    cost: doublePrecision("cost").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    currentPair: uniqueIndex("refusal_index_results_current_pair_uq")
      .on(table.questionId, table.modelId)
      .where(sql`${table.staleAt} IS NULL`),
    runIdx: index("refusal_index_results_run_idx").on(table.runId),
    modelIdx: index("refusal_index_results_model_idx").on(
      table.modelId,
      table.runId,
    ),
  }),
);

/** Admin-approved public samples. Nothing is public unless a row exists and is visible. */
export const refusalIndexSamples = pgTable("refusal_index_samples", {
  id: uuid("id").primaryKey().defaultRandom(),
  resultId: uuid("result_id")
    .notNull()
    .unique()
    .references(() => refusalIndexResults.id, { onDelete: "cascade" }),
  approvedBy: uuid("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedAt: timestamp("approved_at").notNull().defaultNow(),
  visible: boolean("visible").notNull().default(true),
});

export const refusalIndexRunsRelations = relations(
  refusalIndexRuns,
  ({ many }) => ({
    results: many(refusalIndexResults),
  }),
);

export const refusalIndexResultsRelations = relations(
  refusalIndexResults,
  ({ one }) => ({
    run: one(refusalIndexRuns, {
      fields: [refusalIndexResults.runId],
      references: [refusalIndexRuns.id],
    }),
    question: one(refusalIndexQuestions, {
      fields: [refusalIndexResults.questionId],
      references: [refusalIndexQuestions.id],
    }),
    sample: one(refusalIndexSamples, {
      fields: [refusalIndexResults.id],
      references: [refusalIndexSamples.resultId],
    }),
  }),
);

export const selectRefusalQuestionSchema = createSelectSchema(
  refusalIndexQuestions,
);
export const insertRefusalQuestionSchema = createInsertSchema(
  refusalIndexQuestions,
);
export type RefusalQuestion = z.infer<typeof selectRefusalQuestionSchema>;
export type NewRefusalQuestion = z.infer<typeof insertRefusalQuestionSchema>;
export type RefusalRun = typeof refusalIndexRuns.$inferSelect;
export type RefusalResult = typeof refusalIndexResults.$inferSelect;
export type NewRefusalResult = typeof refusalIndexResults.$inferInsert;
