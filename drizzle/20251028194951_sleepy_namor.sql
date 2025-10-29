ALTER TABLE "chat_messages" ADD COLUMN "sequence_id" uuid;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD COLUMN "sequence_index" integer DEFAULT 0 NOT NULL;