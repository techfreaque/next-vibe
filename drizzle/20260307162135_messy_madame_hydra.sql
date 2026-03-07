CREATE TABLE "public_free_tier_daily_cap" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spend_today" numeric(10, 6) DEFAULT 0 NOT NULL,
	"cap_amount" numeric(10, 6) DEFAULT 500 NOT NULL,
	"last_reset_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
