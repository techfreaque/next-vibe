ALTER TABLE "finance_daily_rollups" ALTER COLUMN "upstream_cost_usd" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "finance_daily_rollups" ALTER COLUMN "upstream_cost_usd" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_daily_rollups" ALTER COLUMN "gross_margin_usd" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "finance_daily_rollups" ALTER COLUMN "gross_margin_usd" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "finance_daily_rollups" ADD COLUMN "cost_coverage" text DEFAULT 'enums.costCoverage.none' NOT NULL;