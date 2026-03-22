ALTER TABLE "email_journey_variants" ADD COLUMN "sender_name" text;--> statement-breakpoint
ALTER TABLE "email_journey_variants" ADD COLUMN "company_name" text;--> statement-breakpoint
ALTER TABLE "email_journey_variants" ADD COLUMN "company_email" text;--> statement-breakpoint
UPDATE "error_logs" SET "first_seen" = "created_at" WHERE "first_seen" > "created_at";