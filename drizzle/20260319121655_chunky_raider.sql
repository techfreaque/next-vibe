ALTER TABLE "chat_threads" ADD COLUMN "streaming_state" text DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_threads" DROP COLUMN "is_streaming";