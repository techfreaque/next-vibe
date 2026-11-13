-- Stripe subscription renewals are recorded as payment_transactions keyed by
-- their invoice id, so referral commission is booked on every paid renewal.
-- The unique key makes concurrent invoice.paid / invoice.payment_succeeded
-- deliveries record each renewal exactly once. Existing rows stay NULL.
ALTER TABLE "payment_transactions" ADD COLUMN "provider_invoice_id" text;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_provider_invoice_id_unique" UNIQUE("provider_invoice_id");
