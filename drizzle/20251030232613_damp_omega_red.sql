-- Add allowed_roles column to chat_threads table
ALTER TABLE "chat_threads" ADD COLUMN "allowed_roles" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
CREATE INDEX "chat_threads_allowed_roles_idx" ON "chat_threads" USING gin ("allowed_roles");--> statement-breakpoint

-- Set default allowed_roles based on rootFolderId for existing threads
-- PUBLIC threads: visible to all roles
UPDATE "chat_threads"
SET "allowed_roles" = '["PUBLIC", "CUSTOMER", "ADMIN"]'::jsonb
WHERE "root_folder_id" = 'public';--> statement-breakpoint

-- PRIVATE threads: owner only (empty array means owner-only)
UPDATE "chat_threads"
SET "allowed_roles" = '[]'::jsonb
WHERE "root_folder_id" = 'private';--> statement-breakpoint

-- SHARED threads: empty for now (will be set via share links)
UPDATE "chat_threads"
SET "allowed_roles" = '[]'::jsonb
WHERE "root_folder_id" = 'shared';--> statement-breakpoint

-- INCOGNITO threads: local only (empty array)
UPDATE "chat_threads"
SET "allowed_roles" = '[]'::jsonb
WHERE "root_folder_id" = 'incognito';