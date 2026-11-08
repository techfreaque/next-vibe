-- Referral earnings: remember the purchase credits each commission was computed
-- from, so the 30-day PENDING -> CONFIRMED cron can record exact audit metadata.
-- Nullable: legacy rows predate the column.
ALTER TABLE "referral_earnings" ADD COLUMN IF NOT EXISTS "base_credits" integer;
