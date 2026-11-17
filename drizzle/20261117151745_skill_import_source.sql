ALTER TABLE "custom_skills" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "import_source" jsonb;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "import_source_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "custom_skills_user_import_source_idx" ON "custom_skills" USING btree ("user_id","import_source_key");