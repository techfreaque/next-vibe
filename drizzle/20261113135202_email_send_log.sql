-- At-most-once campaign mail: email_send_log holds one row per
-- (journey_variant, stage, normalized address). The dispatcher claims that
-- row (INSERT ... ON CONFLICT) before handing a mail to SMTP, so the same
-- newsletter / journey mail can never reach the same address twice, whatever
-- the number of leads, locales, reruns, retries or concurrent dispatchers.
CREATE TABLE "email_send_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_variant" text NOT NULL,
	"stage" text NOT NULL,
	"email" text NOT NULL,
	"campaign_id" uuid,
	"lead_id" uuid,
	"locale" text,
	"status" text DEFAULT 'enums.status.pending' NOT NULL,
	"error" text,
	"claimed_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "email_send_log" ADD CONSTRAINT "email_send_log_campaign_id_email_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."email_campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_send_log" ADD CONSTRAINT "email_send_log_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_email_send_log_variant_stage_email" ON "email_send_log" USING btree ("journey_variant","stage","email");--> statement-breakpoint
CREATE INDEX "idx_email_send_log_campaign" ON "email_send_log" USING btree ("campaign_id");--> statement-breakpoint
-- Backfill: every campaign mail that already went out claims its key (the
-- earliest send per key wins), so nothing already delivered is sent again.
INSERT INTO "email_send_log" ("journey_variant", "stage", "email", "campaign_id", "lead_id", "locale", "status", "claimed_at", "sent_at")
SELECT DISTINCT ON (ec."journey_variant", ec."stage", lower(btrim(coalesce(l."email", u."email"))))
  ec."journey_variant",
  ec."stage",
  lower(btrim(coalesce(l."email", u."email"))),
  ec."id",
  ec."lead_id",
  l."language" || '-' || l."country",
  'enums.status.sent',
  coalesce(ec."sent_at", ec."updated_at"),
  coalesce(ec."sent_at", ec."updated_at")
FROM "email_campaigns" ec
JOIN "leads" l ON l."id" = ec."lead_id"
LEFT JOIN "users" u ON u."id" = l."converted_user_id"
WHERE coalesce(l."email", u."email") IS NOT NULL
  AND (
    ec."sent_at" IS NOT NULL
    OR ec."status" IN ('enums.status.sent', 'enums.status.delivered', 'enums.status.opened', 'enums.status.clicked', 'enums.status.bounced', 'enums.status.unsubscribed')
  )
ORDER BY ec."journey_variant", ec."stage", lower(btrim(coalesce(l."email", u."email"))), coalesce(ec."sent_at", ec."updated_at"), ec."id"
ON CONFLICT DO NOTHING;--> statement-breakpoint
-- Mark (never delete) duplicate PENDING rows: one address on several leads
-- (e.g. a user with many lead rows) had one pending row per lead for the
-- same mail. Keep one per key, preferring a lead that carries the address
-- itself, then the earliest; mark the rest FAILED. Keys already sent are
-- marked as well. No-op when there are no duplicates.
WITH pending AS (
  SELECT
    ec."id",
    ec."journey_variant",
    ec."stage",
    lower(btrim(coalesce(l."email", u."email"))) AS em,
    row_number() OVER (
      PARTITION BY ec."journey_variant", ec."stage", lower(btrim(coalesce(l."email", u."email")))
      ORDER BY (l."email" IS NULL), ec."scheduled_at", ec."created_at", ec."id"
    ) AS rn
  FROM "email_campaigns" ec
  JOIN "leads" l ON l."id" = ec."lead_id"
  LEFT JOIN "users" u ON u."id" = l."converted_user_id"
  WHERE ec."status" = 'enums.status.pending'
    AND ec."sent_at" IS NULL
    AND coalesce(l."email", u."email") IS NOT NULL
),
marked AS (
  SELECT
    p."id",
    CASE
      WHEN EXISTS (
        SELECT 1 FROM "email_send_log" s
        WHERE s."journey_variant" = p."journey_variant"
          AND s."stage" = p."stage"
          AND s."email" = p.em
      ) THEN 'duplicate:already_sent'
      WHEN p.rn > 1 THEN 'duplicate:recipient'
    END AS reason
  FROM pending p
)
UPDATE "email_campaigns" ec
SET "status" = 'enums.status.failed',
  "error" = m.reason,
  "updated_at" = now()
FROM marked m
WHERE ec."id" = m."id"
  AND m.reason IS NOT NULL;
