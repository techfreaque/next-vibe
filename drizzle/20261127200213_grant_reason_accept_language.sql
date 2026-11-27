ALTER TABLE "credit_packs" ADD COLUMN "grant_reason" text;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "grant_reason" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "accept_language" text;