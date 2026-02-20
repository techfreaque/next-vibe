CREATE TABLE "messaging_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"channel" text NOT NULL,
	"provider" text NOT NULL,
	"from_id" text,
	"api_token" text,
	"api_secret" text,
	"webhook_url" text,
	"status" text DEFAULT 'app.api.emails.messaging.enums.accountStatus.active' NOT NULL,
	"is_default" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"last_health_check" timestamp,
	"consecutive_failures" integer DEFAULT 0,
	"last_failure_at" timestamp,
	"last_failure_reason" text,
	"messages_sent_today" integer DEFAULT 0,
	"messages_sent_total" integer DEFAULT 0,
	"last_used_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messaging_accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ssh_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
	"host" text NOT NULL,
	"port" integer DEFAULT 22 NOT NULL,
	"username" text NOT NULL,
	"auth_type" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"encrypted_passphrase" text,
	"fingerprint" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "side_task_executions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "side_task_health_checks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "side_tasks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "side_task_executions" CASCADE;--> statement-breakpoint
DROP TABLE "side_task_health_checks" CASCADE;--> statement-breakpoint
DROP TABLE "side_tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "source" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "channel" text DEFAULT 'app.api.emails.messaging.enums.channel.email' NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "from_phone" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "to_phone" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "messaging_account_id" uuid;--> statement-breakpoint
ALTER TABLE "email_campaigns" ADD COLUMN "campaign_type" text DEFAULT 'app.api.emails.enums.smtpCampaignType.leadCampaign' NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "messaging_accounts" ADD CONSTRAINT "messaging_accounts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messaging_accounts" ADD CONSTRAINT "messaging_accounts_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ssh_connections" ADD CONSTRAINT "ssh_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messaging_accounts_channel_idx" ON "messaging_accounts" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "messaging_accounts_provider_idx" ON "messaging_accounts" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "messaging_accounts_status_idx" ON "messaging_accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messaging_accounts_is_default_idx" ON "messaging_accounts" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "messaging_accounts_created_by_idx" ON "messaging_accounts" USING btree ("created_by");--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD CONSTRAINT "cron_tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "emails_channel_idx" ON "emails" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "emails_to_phone_idx" ON "emails" USING btree ("to_phone");--> statement-breakpoint
CREATE INDEX "emails_messaging_account_id_idx" ON "emails" USING btree ("messaging_account_id");