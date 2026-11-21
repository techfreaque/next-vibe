-- Idempotent: dev databases may already hold this table from an earlier push.
CREATE TABLE IF NOT EXISTS "error_log_daily" (
	"fingerprint" text NOT NULL,
	"day" timestamp NOT NULL,
	"occurrences" integer DEFAULT 0 NOT NULL,
	"user_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lead_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "error_log_daily_fingerprint_day_pk" PRIMARY KEY("fingerprint","day")
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "error_log_daily" ADD CONSTRAINT "error_log_daily_fingerprint_error_logs_fingerprint_fk" FOREIGN KEY ("fingerprint") REFERENCES "public"."error_logs"("fingerprint") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "error_log_daily_day_idx" ON "error_log_daily" USING btree ("day");
--> statement-breakpoint
-- Backfill: existing error classes get their total on their last-seen day (history starts here; the UI labels the start).
INSERT INTO error_log_daily (fingerprint, day, occurrences, user_ids, lead_ids)
SELECT e.fingerprint, date_trunc('day', e.created_at), e.occurrences,
  COALESCE((SELECT jsonb_agg(DISTINCT m->>'userId') FROM jsonb_array_elements(e.metadata) m WHERE jsonb_typeof(m) = 'object' AND m->>'userId' ~ '^[0-9a-f-]{36}$'), '[]'::jsonb),
  COALESCE((SELECT jsonb_agg(DISTINCT m->>'leadId') FROM jsonb_array_elements(e.metadata) m WHERE jsonb_typeof(m) = 'object' AND m->>'leadId' ~ '^[0-9a-f-]{36}$'), '[]'::jsonb)
FROM error_logs e
WHERE jsonb_typeof(e.metadata) = 'array'
  AND NOT EXISTS (SELECT 1 FROM error_log_daily d WHERE d.fingerprint = e.fingerprint)
ON CONFLICT DO NOTHING;
