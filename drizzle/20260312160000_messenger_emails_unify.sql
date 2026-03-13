-- Rename imap_folders to messenger_folders
ALTER TABLE "imap_folders" RENAME TO "messenger_folders";--> statement-breakpoint

-- Rename the FK constraint on messenger_folders
ALTER TABLE "messenger_folders" RENAME CONSTRAINT "imap_folders_account_id_messenger_accounts_id_fk" TO "messenger_folders_account_id_messenger_accounts_id_fk";--> statement-breakpoint

-- Unify emails table: add new channel-agnostic columns
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "account_id" uuid;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "uid" integer;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "message_id" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN IF NOT EXISTS "folder_id" uuid;--> statement-breakpoint

-- Migrate data from old columns to new unified columns
UPDATE "emails" SET
  "account_id" = COALESCE(
    (CASE WHEN "smtp_account_id" IS NOT NULL THEN "smtp_account_id" END),
    (CASE WHEN "imap_account_id" IS NOT NULL THEN "imap_account_id" END),
    (CASE WHEN "messaging_account_id" IS NOT NULL THEN "messaging_account_id" END)
  ),
  "uid" = COALESCE("uid", "imap_uid"),
  "message_id" = COALESCE("message_id", "imap_message_id"),
  "folder_id" = COALESCE(
    "folder_id",
    (CASE WHEN "imap_folder_id" IS NOT NULL THEN "imap_folder_id" END)
  );--> statement-breakpoint

-- Drop old columns
ALTER TABLE "emails" DROP COLUMN IF EXISTS "smtp_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "messaging_account_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_uid";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_message_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "imap_folder_id";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "email_provider";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "external_id";--> statement-breakpoint

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS "emails_account_id_idx" ON "emails" ("account_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_uid_idx" ON "emails" ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_message_id_idx" ON "emails" ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emails_folder_id_idx" ON "emails" ("folder_id");--> statement-breakpoint

-- Add FK constraints
ALTER TABLE "emails" ADD CONSTRAINT "emails_folder_id_messenger_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."messenger_folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_account_id_messenger_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."messenger_accounts"("id") ON DELETE set null ON UPDATE no action;
