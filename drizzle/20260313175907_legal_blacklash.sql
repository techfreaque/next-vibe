CREATE TABLE IF NOT EXISTS "messenger_folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"path" text NOT NULL,
	"delimiter" text DEFAULT '/',
	"is_selectable" boolean DEFAULT true,
	"has_children" boolean DEFAULT false,
	"special_use_type" text,
	"uid_validity" integer,
	"uid_next" integer,
	"message_count" integer DEFAULT 0,
	"unseen_count" integer DEFAULT 0,
	"account_id" uuid NOT NULL,
	"last_sync_at" timestamp,
	"sync_status" text DEFAULT 'enums.syncStatus.pending',
	"sync_error" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "emails_template_version_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_imap_uid_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_imap_message_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_imap_folder_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_smtp_account_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_imap_account_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "emails_messaging_account_id_idx";--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "account_id" uuid;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "uid" integer;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "message_id" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "folder_id" uuid;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN IF NOT EXISTS "fingerprint" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN IF NOT EXISTS "occurrences" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN IF NOT EXISTS "resolved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- Backfill fingerprints for existing rows before unique constraint
UPDATE "error_logs" SET "fingerprint" = md5(coalesce("error_type", 'unknown') || ':' || left("message", 100)) WHERE "fingerprint" = '';--> statement-breakpoint
-- Dedup existing rows: keep newest per fingerprint, sum occurrences, delete rest
DO $$
BEGIN
  IF (SELECT count(*) FROM error_logs GROUP BY fingerprint HAVING count(*) > 1 LIMIT 1) IS NOT NULL THEN
    WITH ranked AS (
      SELECT id, fingerprint,
        ROW_NUMBER() OVER (PARTITION BY fingerprint ORDER BY created_at DESC) as rn,
        SUM(occurrences) OVER (PARTITION BY fingerprint) as total_occ
      FROM error_logs
      WHERE fingerprint != ''
    ),
    keepers AS (
      UPDATE error_logs SET occurrences = ranked.total_occ
      FROM ranked WHERE error_logs.id = ranked.id AND ranked.rn = 1
      RETURNING error_logs.id, error_logs.fingerprint
    )
    DELETE FROM error_logs WHERE id NOT IN (SELECT id FROM keepers) AND fingerprint IN (SELECT fingerprint FROM keepers);
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "messenger_folders" DROP CONSTRAINT IF EXISTS "messenger_folders_account_id_messenger_accounts_id_fk";--> statement-breakpoint
ALTER TABLE "messenger_folders" ADD CONSTRAINT "messenger_folders_account_id_messenger_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."messenger_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messenger_folders_account_id_idx" ON "messenger_folders" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messenger_folders_path_idx" ON "messenger_folders" USING btree ("path");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messenger_folders_special_use_idx" ON "messenger_folders" USING btree ("special_use_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_uid_idx" ON "emails" USING btree ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_message_id_idx" ON "emails" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_folder_id_idx" ON "emails" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_account_id_idx" ON "emails" USING btree ("account_id");--> statement-breakpoint
DROP INDEX IF EXISTS "error_logs_fingerprint_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "error_logs_fingerprint_idx" ON "error_logs" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "error_logs_resolved_idx" ON "error_logs" USING btree ("resolved");--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "email_provider";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "external_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "messaging_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "smtp_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_uid";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_message_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_folder_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_account_id";--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'error_logs_fingerprint_unique') THEN
    ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_fingerprint_unique" UNIQUE USING INDEX "error_logs_fingerprint_idx";
  END IF;
END $$;
