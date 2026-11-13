-- Anti-farming for free credits:
-- free_pool_claims = which free pools a subnet (IPv4 /24, IPv6 /64) has used
-- this period (accounts per month, guests per day); granted=false marks a pool
-- that hit the subnet budget and gets no free credits this period.
-- anti_farming_events = blocked attempts for the admin report and alerts.
-- New empty tables: no data touched.
CREATE TABLE "anti_farming_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"subnet" text,
	"email_domain" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "free_pool_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"subnet" text NOT NULL,
	"period" text NOT NULL,
	"pool_key" text NOT NULL,
	"granted" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_anti_farming_events_created" ON "anti_farming_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_anti_farming_events_kind" ON "anti_farming_events" USING btree ("kind","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_free_pool_claims_pool_period" ON "free_pool_claims" USING btree ("kind","period","pool_key");--> statement-breakpoint
CREATE INDEX "idx_free_pool_claims_subnet" ON "free_pool_claims" USING btree ("kind","subnet","period");