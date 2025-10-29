-- Add message sequencing fields to chat_messages table
ALTER TABLE "chat_messages" ADD COLUMN "sequence_id" uuid;
ALTER TABLE "chat_messages" ADD COLUMN "sequence_index" integer DEFAULT 0 NOT NULL;

-- Create index for efficient sequence queries
CREATE INDEX IF NOT EXISTS "chat_messages_sequence_id_idx" ON "chat_messages" ("sequence_id");
CREATE INDEX IF NOT EXISTS "chat_messages_sequence_id_sequence_index_idx" ON "chat_messages" ("sequence_id", "sequence_index");

