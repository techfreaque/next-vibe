ALTER TABLE "leads" ADD COLUMN "uncensored_consent_at" timestamp;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "uncensored_consent_version" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "uncensored_consent_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "uncensored_consent_version" integer;