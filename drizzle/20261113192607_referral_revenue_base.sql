-- Referral commission is computed on revenue (amount paid, USD cents), not
-- on credits granted. Existing rows keep NULL: legacy earnings stay as paid.
ALTER TABLE "referral_earnings" ADD COLUMN "base_amount_usd_cents" integer;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD COLUMN "original_amount_cents" integer;
