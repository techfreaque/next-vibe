CREATE TABLE "model_catalog_scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"new_model_count" integer DEFAULT 0 NOT NULL,
	"price_change_count" integer DEFAULT 0 NOT NULL,
	"missing_count" integer DEFAULT 0 NOT NULL,
	"deprecation_count" integer DEFAULT 0 NOT NULL,
	"source_error_count" integer DEFAULT 0 NOT NULL,
	"report" jsonb NOT NULL,
	"emailed_to" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"email_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "model_catalog_scans_created_at_idx" ON "model_catalog_scans" USING btree ("created_at");