ALTER TABLE "chat_messages" ADD COLUMN "embedding" vector(3072);--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "embedding_hash" text;