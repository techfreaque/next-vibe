CREATE TABLE "finance_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"subject" text NOT NULL,
	"dedup_key" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"delivery" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_daily_rollups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" timestamp NOT NULL,
	"gross_revenue_usd" double precision DEFAULT 0 NOT NULL,
	"refunds_usd" double precision DEFAULT 0 NOT NULL,
	"disputes_usd" double precision DEFAULT 0 NOT NULL,
	"net_revenue_usd" double precision DEFAULT 0 NOT NULL,
	"upstream_cost_usd" double precision DEFAULT 0 NOT NULL,
	"gross_margin_usd" double precision DEFAULT 0 NOT NULL,
	"gross_margin_pct" double precision,
	"internal_billed_usd" double precision DEFAULT 0 NOT NULL,
	"billing_gap_pct" double precision,
	"cancellation_count" integer DEFAULT 0 NOT NULL,
	"per_provider_spend" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"computed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "finance_daily_rollups_day_unique" UNIQUE("day")
);
--> statement-breakpoint
CREATE TABLE "finance_provider_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"bucket_at" timestamp NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL,
	"balance_usd" double precision,
	"balance_native" double precision,
	"unit" text DEFAULT 'usd' NOT NULL,
	"cumulative_usage_usd" double precision,
	"spend_usd" double precision,
	"elapsed_hours" double precision,
	CONSTRAINT "uq_finance_provider_snapshots_provider_bucket" UNIQUE("provider","bucket_at")
);
--> statement-breakpoint
CREATE TABLE "finance_revenue_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"kind" text NOT NULL,
	"external_id" text NOT NULL,
	"amount_usd" double precision DEFAULT 0 NOT NULL,
	"fee_usd" double precision DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"occurred_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_finance_revenue_events_source_ext" UNIQUE("source","kind","external_id")
);
--> statement-breakpoint
CREATE TABLE "finance_revenue_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"day" timestamp NOT NULL,
	"gross_usd" double precision DEFAULT 0 NOT NULL,
	"refunds_usd" double precision DEFAULT 0 NOT NULL,
	"disputes_usd" double precision DEFAULT 0 NOT NULL,
	"net_usd" double precision DEFAULT 0 NOT NULL,
	"payouts_usd" double precision DEFAULT 0 NOT NULL,
	"payment_count" integer DEFAULT 0 NOT NULL,
	"refund_count" integer DEFAULT 0 NOT NULL,
	"dispute_count" integer DEFAULT 0 NOT NULL,
	"cancellation_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_finance_revenue_snapshots_source_day" UNIQUE("source","day")
);
--> statement-breakpoint
CREATE TABLE "finance_source_status" (
	"source" text PRIMARY KEY NOT NULL,
	"last_run_at" timestamp NOT NULL,
	"last_status" text NOT NULL,
	"last_reason" text,
	"last_ok_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "finance_thresholds" (
	"key" text PRIMARY KEY NOT NULL,
	"value" double precision NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_finance_alerts_dedup" ON "finance_alerts" USING btree ("dedup_key","created_at");--> statement-breakpoint
CREATE INDEX "idx_finance_alerts_created" ON "finance_alerts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_finance_provider_snapshots_bucket" ON "finance_provider_snapshots" USING btree ("bucket_at");--> statement-breakpoint
CREATE INDEX "idx_finance_revenue_events_occurred" ON "finance_revenue_events" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "idx_finance_revenue_snapshots_day" ON "finance_revenue_snapshots" USING btree ("day");