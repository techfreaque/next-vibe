-- Liveness for streaming claims: the process owning chat_threads.streaming_run_id
-- stamps streaming_heartbeat_at every minute while the run is live. The
-- stale-run reaper only takes over claims whose heartbeat stopped (owner
-- process died mid-answer). Existing rows stay NULL: the reaper then falls
-- back to updated_at plus message activity.
ALTER TABLE "chat_threads" ADD COLUMN "streaming_heartbeat_at" timestamp;--> statement-breakpoint
CREATE INDEX "chat_threads_streaming_state_idx" ON "chat_threads" USING btree ("streaming_state") WHERE "chat_threads"."streaming_state" <> 'idle';
--> statement-breakpoint
-- Error messages used to store their type only in metadata, so a reloaded
-- thread lost it (a "stopped" indicator rendered as a generic error bubble).
-- createErrorMessage now writes the column; backfill the existing rows.
UPDATE "chat_messages" SET "error_type" = "metadata"->>'errorType' WHERE "role" = 'error' AND "error_type" IS NULL AND "metadata"->>'errorType' IS NOT NULL;
