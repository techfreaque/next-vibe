ALTER TABLE "finance_source_status" ADD COLUMN "low_balance_severity" text;--> statement-breakpoint
ALTER TABLE "finance_source_status" ADD COLUMN "low_balance_observed_at" timestamp;