ALTER TABLE "remote_connections" ADD COLUMN "tool_source" text DEFAULT 'local' NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "routing_rules" jsonb;--> statement-breakpoint
-- Migrate isSystemProvider=true rows to routingRules.
-- These were the UNBOTTLED AI provider connections; they handled model routing
-- via a hardcoded flag. The new routing system uses declarative rules.
UPDATE "remote_connections"
SET
  "routing_rules" = '{"folderIds":["support"],"handlesModelProviders":["UNBOTTLED"],"isDefault":true}'::jsonb,
  "tool_source" = 'remote'
WHERE "is_system_provider" = true;