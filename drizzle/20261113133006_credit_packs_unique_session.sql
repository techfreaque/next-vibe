-- Credit grants are idempotent per metadata.sessionId (Stripe/NOWPayments
-- session, renewal_<sub>_<periodEndMs>, dispute-won:<id>, payout_<request>).
-- addUserCredits used check-then-insert, so concurrent callers (webhook +
-- success redirect + parallel getSubscription safety nets) minted the same
-- grant several times. Before the unique index can exist, retire the
-- duplicate keys (customer-friendly: no credits are taken back):
--   * keep the key on the earliest pack per key (created_at, id);
--   * on every later pack, and on its grant transactions, move the key to
--     metadata.duplicateOfSessionId so refund/clawback grant sums only count
--     the real grant. remaining credits and wallet balances are untouched.
-- No-op when there are no duplicates.
WITH dup_keys AS (
  SELECT "metadata"->>'sessionId' AS k
  FROM "credit_packs"
  WHERE ("metadata"->>'sessionId') IS NOT NULL
  GROUP BY 1
  HAVING count(*) > 1
),
dups AS (
  SELECT r."id", r.k
  FROM (
    SELECT p."id", d.k,
      row_number() OVER (PARTITION BY d.k ORDER BY p."created_at", p."id") AS rn
    FROM "credit_packs" p
    JOIN dup_keys d ON d.k = p."metadata"->>'sessionId'
  ) r
  WHERE r.rn > 1
),
upd_grant_tx AS (
  UPDATE "credit_transactions" t
  SET "metadata" = (t."metadata" - 'sessionId') || jsonb_build_object('duplicateOfSessionId', d.k)
  FROM dups d
  WHERE t."pack_id" = d."id"
    AND t."amount" > 0
    AND (t."metadata"->>'sessionId') IS NOT NULL
  RETURNING t."id"
)
UPDATE "credit_packs" c
SET "metadata" = (c."metadata" - 'sessionId') || jsonb_build_object('duplicateOfSessionId', d.k),
  "updated_at" = now()
FROM dups d
WHERE c."id" = d."id";--> statement-breakpoint
CREATE UNIQUE INDEX "uq_packs_session_id" ON "credit_packs" USING btree (("metadata"->>'sessionId')) WHERE ("credit_packs"."metadata"->>'sessionId') IS NOT NULL;
