-- Analytics blind spots (2026-11-22): visitor country, signup step events,
-- funding bucket per usage debit. Idempotent: safe to re-run on a database
-- that already holds part of it.
CREATE TABLE IF NOT EXISTS "geo_ip_databases" (
	"id" text PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"data" text NOT NULL,
	"v4_ranges" integer NOT NULL,
	"v6_ranges" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signup_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"pending_id" uuid NOT NULL,
	"type" text NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"dedupe_key" text,
	CONSTRAINT "signup_events_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN IF NOT EXISTS "funding_type" text;--> statement-breakpoint
ALTER TABLE "growth_visits" ADD COLUMN IF NOT EXISTS "geo_country" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "geo_country" text;--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "signup_events" ADD CONSTRAINT "signup_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signup_events_occurred_idx" ON "signup_events" USING btree ("occurred_at","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signup_events_lead_idx" ON "signup_events" USING btree ("lead_id");
--> statement-breakpoint
-- Signup steps already on record: every pending row still present was started
-- and (when it has a message id) sent; flagged ones bounced. Earlier steps
-- are gone with their consumed rows and are not invented.
INSERT INTO signup_events (lead_id, pending_id, type, occurred_at, dedupe_key)
SELECT p.lead_id, p.id, 'events.started', p.sent_at, 'backfill-started:' || p.id::text
FROM pending_signups p
UNION ALL
SELECT p.lead_id, p.id, 'events.emailSent', p.sent_at, 'backfill-sent:' || p.id::text
FROM pending_signups p WHERE p.message_id IS NOT NULL
UNION ALL
SELECT p.lead_id, p.id, 'events.bounced', p.sent_at,
  'bounced:' || p.id::text || ':' || (extract(epoch from p.sent_at) * 1000)::bigint::text
FROM pending_signups p WHERE p.bounced
ON CONFLICT (dedupe_key) DO NOTHING;
--> statement-breakpoint
-- Funding backfill, exact rules only (prod 2026-11-22: ~31k usage rows of
-- ~62k ledger rows, each statement touches a disjoint subset, well under 50k).
-- 1) Debits whose pack still exists: classify the pack like packFundingType().
UPDATE credit_transactions t SET funding_type = CASE
    WHEN coalesce(pk.metadata->>'sessionId', '') ~ '^(referral-subscription-bonus:|payout_)' THEN 'enums.fundingType.referral'
    WHEN pk.type = 'enums.packType.subscription' THEN 'enums.fundingType.subscription'
    WHEN pk.type = 'enums.packType.earned' THEN 'enums.fundingType.referral'
    WHEN pk.type = 'enums.packType.permanent' THEN 'enums.fundingType.purchased'
    WHEN pk.type = 'enums.packType.bonus' THEN 'enums.fundingType.adminGrant'
    ELSE 'enums.fundingType.packUnknown' END
FROM credit_packs pk
WHERE pk.id = t.pack_id
  AND t.type = 'enums.transactionType.usage'
  AND t.funding_type IS NULL;
--> statement-breakpoint
-- 2) Free debits (lead wallets). Signup carryover mirrors guest spend; a
-- guest pool only holds the plain allowance (no account step, no newsletter
-- bonus), so spend by a lead not yet linked to an account is allowance.
-- Account-pool free debits cannot be split into allowance vs bonus after the
-- fact: free_unknown.
UPDATE credit_transactions t SET funding_type = CASE
    WHEN t.metadata->>'signupCarryover' = 'true' THEN 'enums.fundingType.freeAllowance'
    WHEN NOT EXISTS (
      SELECT 1 FROM user_lead_links l
      WHERE l.lead_id = CASE WHEN t.metadata->>'actorLeadId' ~ '^[0-9a-fA-F-]{36}$'
          THEN (t.metadata->>'actorLeadId')::uuid ELSE w.lead_id END
        AND l.linked_at <= t.created_at
    ) THEN 'enums.fundingType.freeAllowance'
    ELSE 'enums.fundingType.freeUnknown' END
FROM credit_wallets w
WHERE w.id = t.wallet_id
  AND w.lead_id IS NOT NULL
  AND t.type = 'enums.transactionType.usage'
  AND t.funding_type IS NULL
  AND coalesce((t.metadata->>'packCreditsUsed')::numeric, 0) = 0;
--> statement-breakpoint
-- 3) Pack debits whose pack is gone: exact only when every credit that ever
-- entered that wallet came from one funding bucket (packs only come from
-- grants; transfers or unclassifiable grants make the wallet ambiguous).
WITH grant_bucket AS (
  SELECT g.wallet_id, CASE
      WHEN g.type = 'enums.transactionType.subscription' THEN 'enums.fundingType.subscription'
      WHEN g.type = 'enums.transactionType.referralEarning' THEN 'enums.fundingType.referral'
      WHEN coalesce(g.metadata->>'sessionId', '') ~ '^(referral-subscription-bonus:|payout_)' THEN 'enums.fundingType.referral'
      WHEN g.type = 'enums.transactionType.purchase' AND g.metadata ? 'bonusGrant' THEN 'enums.fundingType.adminGrant'
      WHEN g.type = 'enums.transactionType.purchase' AND pk.type = 'enums.packType.bonus' THEN 'enums.fundingType.adminGrant'
      WHEN g.type = 'enums.transactionType.purchase' AND pk.type = 'enums.packType.permanent' THEN 'enums.fundingType.purchased'
      WHEN g.type = 'enums.transactionType.purchase' AND coalesce(g.metadata->>'sessionId', '') <> '' THEN 'enums.fundingType.purchased'
      ELSE NULL END AS bucket
  FROM credit_transactions g
  JOIN credit_wallets w ON w.id = g.wallet_id AND w.user_id IS NOT NULL
  LEFT JOIN credit_packs pk ON pk.id = g.pack_id
  WHERE g.amount > 0
    AND g.type IN ('enums.transactionType.purchase', 'enums.transactionType.subscription',
      'enums.transactionType.referralEarning', 'enums.transactionType.freeGrant',
      'enums.transactionType.transfer')
),
single_bucket AS (
  SELECT wallet_id, min(bucket) AS bucket FROM grant_bucket
  GROUP BY wallet_id
  HAVING count(*) = count(bucket) AND count(DISTINCT bucket) = 1
)
UPDATE credit_transactions t
SET funding_type = coalesce(sb.bucket, 'enums.fundingType.packUnknown')
FROM credit_wallets w
LEFT JOIN single_bucket sb ON sb.wallet_id = w.id
WHERE w.id = t.wallet_id
  AND t.type = 'enums.transactionType.usage'
  AND t.funding_type IS NULL
  AND t.amount < 0;
