ALTER TABLE "remote_connections" ADD COLUMN "loop_location" text DEFAULT 'client' NOT NULL;
--> statement-breakpoint
-- Migrate chat_folders: root_folder_id 'support' → 'remote'
UPDATE "chat_folders" SET "root_folder_id" = 'remote' WHERE "root_folder_id" = 'support';
--> statement-breakpoint
-- Fix routing_rules JSONB that hardcoded "support" in folderIds
UPDATE "remote_connections"
SET "routing_rules" = jsonb_set(
  "routing_rules", '{folderIds}',
  (SELECT jsonb_agg(CASE WHEN elem::text = '"support"' THEN '"remote"'::jsonb ELSE elem END)
   FROM jsonb_array_elements("routing_rules"->'folderIds') AS elem)
)
WHERE "routing_rules" IS NOT NULL AND "routing_rules"->'folderIds' @> '["support"]'::jsonb;