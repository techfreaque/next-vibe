CREATE TABLE IF NOT EXISTS "frame_exchange_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"token" text NOT NULL,
	"auth_token" text,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "frame_exchange_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"ip_address" text,
	"success" boolean DEFAULT false NOT NULL,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"failure_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_remote_connections" ADD COLUMN IF NOT EXISTS "capabilities_version" text;--> statement-breakpoint
ALTER TABLE "user_remote_connections" ADD COLUMN IF NOT EXISTS "memories_hash" text;--> statement-breakpoint
ALTER TABLE "user_remote_connections" ADD COLUMN IF NOT EXISTS "remote_memories_hash" text;--> statement-breakpoint
ALTER TABLE "user_remote_connections" ADD COLUMN IF NOT EXISTS "task_cursor" text;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'frame_exchange_tokens_lead_id_leads_id_fk'
  ) THEN
    ALTER TABLE "frame_exchange_tokens" ADD CONSTRAINT "frame_exchange_tokens_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_email_idx" ON "login_attempts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_ip_idx" ON "login_attempts" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_created_at_idx" ON "login_attempts" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "user_remote_connections" DROP COLUMN IF EXISTS "capabilities_hash";
