-- Lifecycle journeys: one transactional "payment failed" email per subscription
-- dunning episode (subscription_id + payment_failed_at), claimed before sending
-- so S1/S2 runs and retries never double-send. Plus the lead_id index on
-- lifecycle_enrollments (lead lookups and FK cascades). New table + index only,
-- no data change. Idempotent: dev DBs that got the earlier
-- draft of this table keep it.
CREATE TABLE IF NOT EXISTS "lifecycle_billing_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"episode_key" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'enums.sendStatus.pending' NOT NULL,
	"message_id" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_lifecycle_billing_notice_episode" UNIQUE("subscription_id","episode_key")
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "lifecycle_billing_notices" ADD CONSTRAINT "lifecycle_billing_notices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lifecycle_enrollment_lead" ON "lifecycle_enrollments" USING btree ("lead_id");
