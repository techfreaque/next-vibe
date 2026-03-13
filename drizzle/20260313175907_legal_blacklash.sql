CREATE TABLE "messenger_folders" (
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
DROP INDEX "emails_template_version_idx";--> statement-breakpoint
DROP INDEX "emails_imap_uid_idx";--> statement-breakpoint
DROP INDEX "emails_imap_message_id_idx";--> statement-breakpoint
DROP INDEX "emails_imap_folder_id_idx";--> statement-breakpoint
DROP INDEX "emails_smtp_account_id_idx";--> statement-breakpoint
DROP INDEX "emails_imap_account_id_idx";--> statement-breakpoint
DROP INDEX "emails_messaging_account_id_idx";--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "uid" integer;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "message_id" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "folder_id" uuid;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN "fingerprint" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN "occurrences" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "error_logs" ADD COLUMN "resolved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- Backfill fingerprints for existing rows before unique constraint
UPDATE "error_logs" SET "fingerprint" = md5(coalesce("error_type", 'unknown') || ':' || left("message", 100)) WHERE "fingerprint" = '';--> statement-breakpoint
-- Dedup existing rows: keep newest per fingerprint, sum occurrences, delete rest
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
DELETE FROM error_logs WHERE id NOT IN (SELECT id FROM keepers) AND fingerprint IN (SELECT fingerprint FROM keepers);--> statement-breakpoint
ALTER TABLE "messenger_folders" ADD CONSTRAINT "messenger_folders_account_id_messenger_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."messenger_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messenger_folders_account_id_idx" ON "messenger_folders" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "messenger_folders_path_idx" ON "messenger_folders" USING btree ("path");--> statement-breakpoint
CREATE INDEX "messenger_folders_special_use_idx" ON "messenger_folders" USING btree ("special_use_type");--> statement-breakpoint
CREATE INDEX "emails_uid_idx" ON "emails" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "emails_message_id_idx" ON "emails" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "emails_folder_id_idx" ON "emails" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "emails_account_id_idx" ON "emails" USING btree ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "error_logs_fingerprint_idx" ON "error_logs" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX "error_logs_resolved_idx" ON "error_logs" USING btree ("resolved");--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "email_provider";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "messaging_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "smtp_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "imap_uid";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "imap_message_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "imap_folder_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN "imap_account_id";--> statement-breakpoint
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_fingerprint_unique" UNIQUE("fingerprint");