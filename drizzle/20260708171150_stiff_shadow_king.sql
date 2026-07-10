UPDATE "chat_messages" SET "embedding" = NULL, "embedding_hash" = NULL WHERE "embedding" IS NOT NULL;--> statement-breakpoint
UPDATE "cortex_nodes" SET "embedding" = NULL, "content_hash" = NULL WHERE "embedding" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);--> statement-breakpoint
ALTER TABLE "cortex_nodes" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);