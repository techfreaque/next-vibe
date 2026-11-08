CREATE TABLE "public_cap_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"lead_id" text,
	"ip_hash" text,
	"model" text,
	"cost" numeric(10, 6) DEFAULT 0 NOT NULL,
	"spend_today" numeric(10, 6) DEFAULT 0 NOT NULL,
	"cap_amount" numeric(10, 6) DEFAULT 0 NOT NULL,
	"hits" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_cap_spenders" (
	"day" text NOT NULL,
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"spend" numeric(10, 6) DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "public_cap_spenders_day_kind_key_pk" PRIMARY KEY("day","kind","key")
);
--> statement-breakpoint
ALTER TABLE "public_free_tier_daily_cap" ADD COLUMN "per_lead_cap" numeric(10, 6) DEFAULT 20 NOT NULL;--> statement-breakpoint
ALTER TABLE "public_free_tier_daily_cap" ADD COLUMN "per_ip_cap" numeric(10, 6) DEFAULT 40 NOT NULL;--> statement-breakpoint
CREATE INDEX "public_cap_events_created_idx" ON "public_cap_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "public_cap_spenders_day_spend_idx" ON "public_cap_spenders" USING btree ("day","spend");