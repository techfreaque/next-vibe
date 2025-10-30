ALTER TABLE "chat_folders" ADD COLUMN "allowed_roles" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
CREATE INDEX "chat_folders_allowed_roles_idx" ON "chat_folders" USING gin ("allowed_roles");