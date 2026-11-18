ALTER TABLE "finance_provider_snapshots" ADD COLUMN "spend_native" double precision;--> statement-breakpoint
ALTER TABLE "finance_source_status" ADD COLUMN "low_balance_since" timestamp;--> statement-breakpoint
ALTER TABLE "finance_source_status" ADD COLUMN "low_balance_floor_usd" double precision;