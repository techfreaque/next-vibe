-- Free credit grants are idempotent per pool + month + kind: every monthly
-- refill, first-visit grant and tier top-up carries metadata.grantKey
-- (free:<pool>:<YYYY-MM>:<kind>) and inserts ON CONFLICT DO NOTHING, so
-- concurrent reads can never mint the same grant twice. No existing row has
-- grantKey, so the index builds without touching data.
CREATE UNIQUE INDEX "uq_transactions_grant_key" ON "credit_transactions" USING btree (("metadata"->>'grantKey')) WHERE ("credit_transactions"."metadata"->>'grantKey') IS NOT NULL;