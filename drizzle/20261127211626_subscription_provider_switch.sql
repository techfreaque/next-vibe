CREATE TABLE "subscription_provider_switches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_provider" text NOT NULL,
	"from_subscription_id" text NOT NULL,
	"to_provider" text NOT NULL,
	"to_subscription_id" text,
	"carry_over" text NOT NULL,
	"billing_start_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'enums.status.pending' NOT NULL,
	"cancel_mode" text,
	"new_period_start" timestamp with time zone,
	"new_period_end" timestamp with time zone,
	"cancel_error" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_switch_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" text NOT NULL,
	"status" text DEFAULT 'enums.notice.sending' NOT NULL,
	"error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_switch_notices_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "subscription_provider_switches" ADD CONSTRAINT "subscription_provider_switches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_switch_notices" ADD CONSTRAINT "subscription_switch_notices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscription_provider_switches_user_id_idx" ON "subscription_provider_switches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_provider_switches_from_sub_idx" ON "subscription_provider_switches" USING btree ("from_subscription_id");