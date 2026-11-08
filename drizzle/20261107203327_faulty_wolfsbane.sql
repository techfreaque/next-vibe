-- Free-credit newsletter bonus: subscription -> claiming lead, double opt-in token.
-- Idempotent: an earlier draft of this migration may already be applied on dev DBs.
ALTER TABLE "newsletter_subscriptions" ADD COLUMN IF NOT EXISTS "lead_id" uuid;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'newsletter_subscriptions_lead_id_leads_id_fk') THEN
    ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscriptions_lead_id" ON "newsletter_subscriptions" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscriptions_user_id" ON "newsletter_subscriptions" USING btree ("user_id");--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'newsletter_subscriptions_confirmation_token_unique') THEN
    ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_confirmation_token_unique" UNIQUE("confirmation_token");
  END IF;
END $$;
