CREATE TABLE "messenger_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"channel" text NOT NULL,
	"provider" text NOT NULL,
	"smtp_host" text,
	"smtp_port" integer,
	"smtp_security_type" text,
	"smtp_username" text,
	"smtp_password" text,
	"smtp_from_email" text,
	"smtp_connection_timeout" integer,
	"smtp_max_connections" integer,
	"smtp_rate_limit_per_hour" integer,
	"api_key" text,
	"api_token" text,
	"api_secret" text,
	"from_id" text,
	"webhook_url" text,
	"imap_host" text,
	"imap_port" integer,
	"imap_secure" boolean,
	"imap_username" text,
	"imap_password" text,
	"imap_auth_method" text,
	"imap_connection_timeout" integer,
	"imap_keep_alive" boolean,
	"imap_sync_enabled" boolean DEFAULT false,
	"imap_sync_interval" integer,
	"imap_max_messages" integer,
	"imap_sync_folders" jsonb,
	"imap_last_sync_at" timestamp,
	"imap_sync_error" text,
	"imap_is_connected" boolean DEFAULT false,
	"campaign_types" jsonb DEFAULT '[]'::jsonb,
	"email_journey_variants" jsonb DEFAULT '[]'::jsonb,
	"email_campaign_stages" jsonb DEFAULT '[]'::jsonb,
	"countries" jsonb DEFAULT '[]'::jsonb,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"is_exact_match" boolean DEFAULT false,
	"weight" integer DEFAULT 1,
	"is_failover" boolean DEFAULT false,
	"failover_priority" integer DEFAULT 0,
	"status" text DEFAULT 'enums.status.inactive' NOT NULL,
	"is_default" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"health_status" text,
	"consecutive_failures" integer DEFAULT 0,
	"last_failure_at" timestamp,
	"last_failure_reason" text,
	"last_health_check" timestamp,
	"messages_sent_today" integer DEFAULT 0,
	"messages_sent_total" integer DEFAULT 0,
	"last_used_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messenger_accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "imap_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "messaging_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "smtp_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "imap_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "messaging_accounts" CASCADE;--> statement-breakpoint
DROP TABLE "smtp_accounts" CASCADE;--> statement-breakpoint
ALTER TABLE "imap_folders" DROP CONSTRAINT IF EXISTS "imap_folders_account_id_imap_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "messenger_accounts" ADD CONSTRAINT "messenger_accounts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messenger_accounts" ADD CONSTRAINT "messenger_accounts_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messenger_accounts_channel_idx" ON "messenger_accounts" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "messenger_accounts_provider_idx" ON "messenger_accounts" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "messenger_accounts_status_idx" ON "messenger_accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messenger_accounts_is_default_idx" ON "messenger_accounts" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "messenger_accounts_priority_idx" ON "messenger_accounts" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "messenger_accounts_created_by_idx" ON "messenger_accounts" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "messenger_accounts_last_health_check_idx" ON "messenger_accounts" USING btree ("last_health_check");--> statement-breakpoint
CREATE INDEX "messenger_accounts_last_used_at_idx" ON "messenger_accounts" USING btree ("last_used_at");--> statement-breakpoint
ALTER TABLE "imap_folders" ADD CONSTRAINT "imap_folders_account_id_messenger_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."messenger_accounts"("id") ON DELETE cascade ON UPDATE no action;