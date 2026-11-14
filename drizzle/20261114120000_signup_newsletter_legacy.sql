-- Data repair: the signup form used to show a pre-ticked "+20 free credits
-- every month" box that set users.marketing_consent but never created a
-- newsletter subscription. Whoever kept it ticked stays a newsletter
-- subscriber: give each such account a confirmed subscription (their consent
-- was given at signup, so confirmed_at = signup time). Delivery then follows
-- the normal audience rules (scheduler getConsentedNewsletterAudience), the
-- email_send_log guard dedupes by address, and the free-credit newsletter
-- bonus follows the normal rules (credits/free-allowance.ts: verified accounts).
-- The lead is the account's signup lead (else its first linked lead).
-- Idempotent: accounts that already have a subscription row (by user or by
-- address, any status, so opt-outs stay opted out) are skipped, and the
-- unique email makes a rerun a no-op.
INSERT INTO "newsletter_subscriptions" (
  "email",
  "name",
  "user_id",
  "lead_id",
  "status",
  "source",
  "subscription_date",
  "confirmed_at",
  "marketing_consent",
  "created_at",
  "updated_at"
)
SELECT
  u."email",
  u."private_name",
  u."id",
  (
    SELECT l."lead_id"
    FROM "user_lead_links" l
    WHERE l."user_id" = u."id"
    ORDER BY CASE WHEN l."link_reason" = 'signup' THEN 0 ELSE 1 END, l."created_at"
    LIMIT 1
  ),
  'enum.status.subscribed',
  'signup-checkbox-legacy',
  u."created_at" AT TIME ZONE 'UTC',
  u."created_at" AT TIME ZONE 'UTC',
  true,
  now(),
  now()
FROM "users" u
WHERE u."marketing_consent" = true
  AND u."is_banned" = false
  AND NOT EXISTS (
    SELECT 1
    FROM "newsletter_subscriptions" s
    WHERE s."user_id" = u."id"
      OR lower(btrim(s."email")) = lower(btrim(u."email"))
  )
ON CONFLICT ("email") DO NOTHING;
