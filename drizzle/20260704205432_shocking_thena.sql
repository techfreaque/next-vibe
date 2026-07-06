ALTER TABLE "chat_threads" ADD COLUMN IF NOT EXISTS "origin_instance_id" text;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD COLUMN IF NOT EXISTS "loop_instance_id" text;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD COLUMN IF NOT EXISTS "sync_eligible" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_threads_origin_instance_id_idx" ON "chat_threads" USING btree ("origin_instance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_threads_loop_instance_id_idx" ON "chat_threads" USING btree ("loop_instance_id");--> statement-breakpoint
-- ── Ownership/routing become explicit columns ────────────────────────────────
-- Placement stays physical (mirrors live under REMOTE/<instance>/…); what
-- retires is DERIVING ownership/routing from folder names. Stamp existing
-- rows once from their current placement, then the columns are authoritative.
-- Mirror copies under REMOTE/<instance>/…: origin + loop = instance name.
WITH RECURSIVE chain AS (
  SELECT id, parent_id, name AS top_name
  FROM chat_folders
  WHERE parent_id IS NULL AND root_folder_id = 'remote'
  UNION ALL
  SELECT f.id, f.parent_id, chain.top_name
  FROM chat_folders f
  JOIN chain ON f.parent_id = chain.id
)
UPDATE chat_threads t
SET origin_instance_id = c.top_name
FROM chain c
WHERE t.folder_id = c.id
  AND t.root_folder_id = 'remote'
  AND t.origin_instance_id IS NULL;--> statement-breakpoint
-- Caller-created threads inside REMOTE/<instance> (their own, routed there):
-- distinguishing them from mirrors by data alone is impossible pre-migration;
-- the sync/relay paths re-stamp on next contact. loop_instance_id for threads
-- the user placed under REMOTE/<instance> is stamped by the first stream.
-- Executor landings under BACKGROUND/remote/<instance>/…: origin = the folder
-- name directly below the top-level "remote" folder (convention retired going
-- forward; existing copies keep working as foreign-origin rows in place).
WITH RECURSIVE chain AS (
  SELECT id, parent_id, name AS top_name, NULL::text AS second_name
  FROM chat_folders
  WHERE parent_id IS NULL AND root_folder_id = 'cron'
  UNION ALL
  SELECT f.id, f.parent_id, chain.top_name, COALESCE(chain.second_name, f.name)
  FROM chat_folders f
  JOIN chain ON f.parent_id = chain.id
)
UPDATE chat_threads t
SET origin_instance_id = c.second_name
FROM chain c
WHERE t.folder_id = c.id
  AND t.root_folder_id = 'cron'
  AND c.top_name = 'remote'
  AND c.second_name IS NOT NULL
  AND t.origin_instance_id IS NULL;
