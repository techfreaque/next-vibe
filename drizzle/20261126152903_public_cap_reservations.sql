CREATE TABLE "public_cap_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pool_key" text NOT NULL,
	"lead_id" text,
	"ip_hash" text,
	"amount" numeric(10, 6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "public_cap_reservations_pool_idx" ON "public_cap_reservations" USING btree ("pool_key","created_at");--> statement-breakpoint
CREATE INDEX "public_cap_reservations_expires_idx" ON "public_cap_reservations" USING btree ("expires_at");