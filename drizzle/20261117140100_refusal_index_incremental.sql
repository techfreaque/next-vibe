-- Refusal Index: answers become permanent per (question, model) instead of
-- per run. One current row (stale_at IS NULL) per pair; a model version change
-- marks the old row stale and adds a new one.
-- Idempotent: it was renamed after it had run on dev databases.
ALTER TABLE "refusal_index_results" DROP CONSTRAINT IF EXISTS "refusal_index_results_run_question_model_uq";--> statement-breakpoint
ALTER TABLE "refusal_index_questions" ADD COLUMN IF NOT EXISTS "text_fr" text;--> statement-breakpoint
ALTER TABLE "refusal_index_questions" ADD COLUMN IF NOT EXISTS "generated_by" text;--> statement-breakpoint
ALTER TABLE "refusal_index_results" ADD COLUMN IF NOT EXISTS "model_version" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "refusal_index_results" ADD COLUMN IF NOT EXISTS "stale_at" timestamp;--> statement-breakpoint
ALTER TABLE "refusal_index_runs" ADD COLUMN IF NOT EXISTS "pair_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "refusal_index_runs" ADD COLUMN IF NOT EXISTS "questions_requested" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "refusal_index_runs" ADD COLUMN IF NOT EXISTS "questions_generated" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Older runs may hold several rows for one pair: keep the newest non-error
-- row current (newest error row when the pair only ever errored), mark the
-- rest stale, so the partial unique index below can be created.
UPDATE "refusal_index_results" r SET "stale_at" = now()
WHERE r."id" NOT IN (
  SELECT DISTINCT ON ("question_id", "model_id") "id"
  FROM "refusal_index_results"
  ORDER BY "question_id", "model_id", ("verdict" = 'enums.verdict.error'), "created_at" DESC
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "refusal_index_results_current_pair_uq" ON "refusal_index_results" USING btree ("question_id","model_id") WHERE "refusal_index_results"."stale_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refusal_index_results_run_idx" ON "refusal_index_results" USING btree ("run_id");
