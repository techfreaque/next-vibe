-- Usage funding backfill, part 2 (2026-11-25). Historic pack debits whose
-- pack row is gone and whose wallet held credits from more than one bucket
-- were left as packUnknown by 20261121232835. Replay each such user wallet's
-- ledger in deductCredits walk order to find the pack bucket each debit drew
-- from: unexpired subscription credits first (soonest expiry; a deleted
-- subscription pack expires 30 days after its grant), then earned referral
-- credits (oldest first), then permanent purchases + bonus grants (newest
-- first). Grant buckets: subscription rows = subscription, referral earnings
-- and referral session keys = referral, bonusGrant flag or bonus pack =
-- adminGrant, permanent pack or a payment session = purchased, any other
-- purchase row (admin grants written before the bonusGrant flag) = adminGrant.
-- Stamped debits drain only their own bucket. A debit spanning two lots takes
-- the bucket it starts in. Debits no lot can cover stay packUnknown.
-- Prod dry run 2026-11-25: 56,247 of 56,290 packUnknown credits resolved
-- (subscription 46,299, purchased 7,308, adminGrant 1,560, referral 81);
-- ~10k rows on 12 wallets, one statement per row, no schema change.
DO $$
DECLARE
  wal record;
  d record;
  l_bucket text[];
  l_created timestamp[];
  l_expires timestamp[];
  l_rem numeric[];
  i int;
  need numeric;
  take numeric;
  first_bucket text;
BEGIN
  FOR wal IN
    SELECT DISTINCT t.wallet_id FROM credit_transactions t
    JOIN credit_wallets w ON w.id = t.wallet_id AND w.user_id IS NOT NULL
    WHERE t.type = 'enums.transactionType.usage'
      AND t.funding_type = 'enums.fundingType.packUnknown'
  LOOP
    -- Credit lots of this wallet in deductCredits walk order: subscription
    -- (soonest expiry first), earned referral credits (oldest first),
    -- permanent + bonus packs (newest first).
    SELECT array_agg(g.bucket ORDER BY g.prio, g.sort_key),
      array_agg(g.created_at ORDER BY g.prio, g.sort_key),
      array_agg(g.expires_at ORDER BY g.prio, g.sort_key),
      array_agg(g.amount ORDER BY g.prio, g.sort_key)
    INTO l_bucket, l_created, l_expires, l_rem
    FROM (
      SELECT c.*,
        CASE c.bucket WHEN 'enums.fundingType.subscription' THEN 0
          WHEN 'enums.fundingType.referral' THEN 1 ELSE 2 END AS prio,
        CASE WHEN c.bucket = 'enums.fundingType.subscription' THEN extract(epoch FROM c.expires_at)
          WHEN c.bucket = 'enums.fundingType.referral' THEN extract(epoch FROM c.created_at)
          ELSE -extract(epoch FROM c.created_at) END AS sort_key
      FROM (
        SELECT g.created_at, g.amount::numeric AS amount,
          CASE
            WHEN g.type = 'enums.transactionType.subscription' THEN 'enums.fundingType.subscription'
            WHEN g.type = 'enums.transactionType.referralEarning' THEN 'enums.fundingType.referral'
            WHEN coalesce(g.metadata->>'sessionId', '') ~ '^(referral-subscription-bonus:|payout_)' THEN 'enums.fundingType.referral'
            WHEN g.metadata ? 'bonusGrant' OR pk.type = 'enums.packType.bonus' THEN 'enums.fundingType.adminGrant'
            WHEN pk.type = 'enums.packType.permanent' OR coalesce(g.metadata->>'sessionId', '') <> '' THEN 'enums.fundingType.purchased'
            ELSE 'enums.fundingType.adminGrant' END AS bucket,
          CASE WHEN g.type = 'enums.transactionType.subscription'
            THEN coalesce(pk.expires_at, g.created_at + interval '30 days') END AS expires_at
        FROM credit_transactions g
        LEFT JOIN credit_packs pk ON pk.id = g.pack_id
        WHERE g.wallet_id = wal.wallet_id AND g.amount > 0
          AND g.type IN ('enums.transactionType.purchase', 'enums.transactionType.subscription',
            'enums.transactionType.referralEarning')
      ) c
    ) g;
    CONTINUE WHEN l_bucket IS NULL;

    FOR d IN
      SELECT t.id, t.created_at, (-t.amount)::numeric AS amt, t.funding_type
      FROM credit_transactions t
      WHERE t.wallet_id = wal.wallet_id
        AND t.type = 'enums.transactionType.usage' AND t.amount < 0
      ORDER BY t.created_at, t.id
    LOOP
      need := d.amt;
      first_bucket := NULL;
      FOR i IN 1 .. array_length(l_bucket, 1) LOOP
        EXIT WHEN need <= 0;
        CONTINUE WHEN l_rem[i] <= 0 OR l_created[i] > d.created_at
          OR (l_expires[i] IS NOT NULL AND l_expires[i] < d.created_at);
        -- A stamped debit only drains lots of its own bucket.
        CONTINUE WHEN d.funding_type <> 'enums.fundingType.packUnknown'
          AND l_bucket[i] <> d.funding_type;
        take := least(need, l_rem[i]);
        l_rem[i] := l_rem[i] - take;
        need := need - take;
        first_bucket := coalesce(first_bucket, l_bucket[i]);
      END LOOP;
      IF d.funding_type = 'enums.fundingType.packUnknown' THEN
        IF first_bucket IS NOT NULL THEN UPDATE credit_transactions SET funding_type = first_bucket WHERE id = d.id; END IF;
      END IF;
    END LOOP;
  END LOOP;
END $$;
