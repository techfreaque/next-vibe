-- Migration: Update JSONB role fields from v1.core to flat structure
-- JSONB columns containing user role enums need text-based replacement

-- JSONB role fields in chat_folders (update array elements)
UPDATE "chat_folders" SET "roles_view" = REPLACE("roles_view"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_view"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_folders" SET "roles_manage" = REPLACE("roles_manage"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_manage"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_folders" SET "roles_create_thread" = REPLACE("roles_create_thread"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_create_thread"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_folders" SET "roles_post" = REPLACE("roles_post"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_post"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_folders" SET "roles_moderate" = REPLACE("roles_moderate"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_moderate"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_folders" SET "roles_admin" = REPLACE("roles_admin"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_admin"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint

-- JSONB role fields in chat_threads (update array elements)
UPDATE "chat_threads" SET "roles_view" = REPLACE("roles_view"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_view"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_threads" SET "roles_edit" = REPLACE("roles_edit"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_edit"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_threads" SET "roles_post" = REPLACE("roles_post"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_post"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_threads" SET "roles_moderate" = REPLACE("roles_moderate"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_moderate"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
UPDATE "chat_threads" SET "roles_admin" = REPLACE("roles_admin"::text, 'app.api.v1.core.user.', 'app.api.user.')::jsonb WHERE "roles_admin"::text LIKE '%app.api.v1.core.user.%';--> statement-breakpoint
