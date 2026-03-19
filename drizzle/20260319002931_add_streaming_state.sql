ALTER TABLE "chat_threads" ADD COLUMN IF NOT EXISTS "streaming_state" text NOT NULL DEFAULT 'idle';
