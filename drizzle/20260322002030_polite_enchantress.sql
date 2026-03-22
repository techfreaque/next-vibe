ALTER TABLE "messenger_folders" ADD COLUMN IF NOT EXISTS "recent_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaign_starter_configs" ADD COLUMN "locale_config" jsonb NOT NULL DEFAULT '{}'::jsonb;--> statement-breakpoint

-- Migrate existing campaign_starter_configs rows into the new locale_config JSONB structure
-- before dropping the old columns. Preserves all data per-locale (uses 'default' as locale key).
UPDATE "campaign_starter_configs"
SET "locale_config" = jsonb_build_object(
  'default', jsonb_build_object(
    'leadsPerWeek', "leads_per_week",
    'enabledDays', "enabled_days",
    'enabledHours', "enabled_hours"
  )
)
WHERE "locale_config" = '{}'::jsonb;--> statement-breakpoint

-- Migrate imap_folders → messenger_folders if the table existed in this environment
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'imap_folders') THEN
    -- Migrate folder rows (upsert by account + path)
    INSERT INTO "messenger_folders" (
      "id", "name", "display_name", "path", "delimiter",
      "is_selectable", "has_children", "special_use_type",
      "uid_validity", "uid_next", "message_count", "recent_count", "unseen_count",
      "account_id", "last_sync_at", "sync_status", "sync_error",
      "created_at", "updated_at"
    )
    SELECT
      gen_random_uuid(),
      f."name", f."display_name", f."path", f."delimiter",
      f."is_selectable", f."has_children",
      CASE f."special_use_type"
        WHEN 'enums.specialUseType.junk'    THEN 'enums.specialFolder.spam'
        WHEN 'enums.specialUseType.inbox'   THEN 'enums.specialFolder.inbox'
        WHEN 'enums.specialUseType.sent'    THEN 'enums.specialFolder.sent'
        WHEN 'enums.specialUseType.drafts'  THEN 'enums.specialFolder.drafts'
        WHEN 'enums.specialUseType.trash'   THEN 'enums.specialFolder.trash'
        WHEN 'enums.specialUseType.archive' THEN 'enums.specialFolder.archive'
        ELSE NULL
      END,
      f."uid_validity", f."uid_next", f."message_count", f."recent_count", f."unseen_count",
      f."account_id", f."last_sync_at", f."sync_status", NULL,
      f."created_at", f."updated_at"
    FROM "imap_folders" f
    WHERE NOT EXISTS (
      SELECT 1 FROM "messenger_folders" mf
      WHERE mf."account_id" = f."account_id" AND mf."path" = f."path"
    );

    -- Fix emails.folder_id references to point to messenger_folders
    UPDATE "emails" e
    SET "folder_id" = mf."id"
    FROM "imap_folders" f
    JOIN "messenger_folders" mf ON mf."account_id" = f."account_id" AND mf."path" = f."path"
    WHERE e."folder_id" = f."id";

    DROP TABLE "imap_folders" CASCADE;
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "campaign_starter_configs" DROP COLUMN "enabled_days";--> statement-breakpoint
ALTER TABLE "campaign_starter_configs" DROP COLUMN "enabled_hours";--> statement-breakpoint
ALTER TABLE "campaign_starter_configs" DROP COLUMN "leads_per_week";--> statement-breakpoint

-- Remove the temporary NOT NULL DEFAULT now that all rows have been populated
ALTER TABLE "campaign_starter_configs" ALTER COLUMN "locale_config" DROP DEFAULT;
