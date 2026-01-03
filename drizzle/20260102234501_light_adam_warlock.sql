DROP INDEX "chat_messages_search_vector_idx";--> statement-breakpoint
ALTER TABLE "chat_messages" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "chat_messages_search_vector_idx" ON "chat_messages" USING gin (to_tsvector('english', COALESCE("content", '')));