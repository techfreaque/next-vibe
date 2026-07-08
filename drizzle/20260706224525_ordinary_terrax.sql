ALTER TABLE "chat_threads" ADD COLUMN "stream_context" jsonb;--> statement-breakpoint
ALTER TABLE "chat_threads" DROP COLUMN "metadata";