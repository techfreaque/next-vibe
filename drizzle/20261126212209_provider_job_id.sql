ALTER TABLE "credit_transactions" ADD COLUMN IF NOT EXISTS "provider_job_id" text;--> statement-breakpoint
ALTER TABLE "v1_media_jobs" ADD COLUMN IF NOT EXISTS "provider_job_id" text;--> statement-breakpoint
ALTER TABLE "studio_generations" ADD COLUMN IF NOT EXISTS "provider_job_id" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_provider_job_id" ON "credit_transactions" USING btree ("provider_job_id") WHERE "credit_transactions"."provider_job_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "v1_media_jobs_provider_job_id_idx" ON "v1_media_jobs" USING btree ("provider_job_id") WHERE "v1_media_jobs"."provider_job_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "studio_generations_provider_job_id_idx" ON "studio_generations" USING btree ("provider_job_id") WHERE "studio_generations"."provider_job_id" IS NOT NULL;
