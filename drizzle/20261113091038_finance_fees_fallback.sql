ALTER TABLE "finance_daily_rollups" ADD COLUMN "processor_fees_usd" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_revenue_snapshots" ADD COLUMN "fees_usd" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_source_status" ADD COLUMN "last_fallback" boolean DEFAULT false NOT NULL;