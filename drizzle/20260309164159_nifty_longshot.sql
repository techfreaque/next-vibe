CREATE TABLE "email_journey_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_key" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"weight" integer DEFAULT 33 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"campaign_type" text,
	"source_file_path" text,
	"check_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_journey_variants_variant_key_unique" UNIQUE("variant_key")
);
--> statement-breakpoint
CREATE INDEX "idx_email_journey_variants_variant_key" ON "email_journey_variants" USING btree ("variant_key");--> statement-breakpoint
CREATE INDEX "idx_email_journey_variants_active" ON "email_journey_variants" USING btree ("active");