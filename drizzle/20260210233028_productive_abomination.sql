ALTER TABLE "subscriptions" ADD COLUMN "payment_failed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "grace_period_ends_at" timestamp with time zone;