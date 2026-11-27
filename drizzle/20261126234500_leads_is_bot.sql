ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "is_bot" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_leads_is_bot" ON "leads" USING btree ("is_bot");
