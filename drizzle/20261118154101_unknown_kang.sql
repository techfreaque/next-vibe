CREATE TABLE "pending_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"private_name" text NOT NULL,
	"public_name" text NOT NULL,
	"subscribe_to_newsletter" boolean NOT NULL,
	"referral_code" text,
	"supported_skill_id" uuid,
	"local_favorites" jsonb,
	"callback_url" text,
	"locale" text NOT NULL,
	"signup_ip" text,
	"code_hash" text NOT NULL,
	"token_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL,
	"sent_at" timestamp NOT NULL,
	"message_id" text,
	"delivery_failed" boolean DEFAULT false NOT NULL,
	"bounced" boolean DEFAULT false NOT NULL,
	CONSTRAINT "pending_signups_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "signup_mail_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"sent_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"lead_id" uuid,
	"kind" text NOT NULL,
	"model" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"url" text,
	"transcript" text,
	"credits" double precision,
	CONSTRAINT "studio_generations_single_owner" CHECK (num_nonnulls("studio_generations"."user_id", "studio_generations"."lead_id") = 1)
);
--> statement-breakpoint
ALTER TABLE "pending_signups" ADD CONSTRAINT "pending_signups_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_generations" ADD CONSTRAINT "studio_generations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_generations" ADD CONSTRAINT "studio_generations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pending_signups_email_idx" ON "pending_signups" USING btree ("email");--> statement-breakpoint
CREATE INDEX "pending_signups_expiry_idx" ON "pending_signups" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "signup_mail_scope_time_idx" ON "signup_mail_attempts" USING btree ("scope","sent_at");--> statement-breakpoint
CREATE INDEX "signup_mail_time_idx" ON "signup_mail_attempts" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "studio_generations_user_created_idx" ON "studio_generations" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "studio_generations_lead_created_idx" ON "studio_generations" USING btree ("lead_id","created_at");