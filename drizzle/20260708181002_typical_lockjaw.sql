DROP INDEX IF EXISTS "chat_threads_search_vector_idx";--> statement-breakpoint
ALTER TABLE "chat_threads" ADD COLUMN "description" text;--> statement-breakpoint
CREATE INDEX "chat_threads_search_vector_idx" ON "chat_threads" USING gin (to_tsvector('english', "title" || ' ' || COALESCE("description", '') || ' ' || COALESCE("system_prompt", '')));--> statement-breakpoint
ALTER TABLE "chat_threads" DROP COLUMN IF EXISTS "preview";
