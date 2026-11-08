CREATE TABLE "growth_campaign_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source" text NOT NULL,
	"medium" text NOT NULL,
	"campaign" text NOT NULL,
	"content" text,
	"term" text,
	"destination_path" text DEFAULT '/' NOT NULL,
	"ref_code" text,
	"visits" integer DEFAULT 0 NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growth_channel_spend" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"channel" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_growth_channel_spend_period" UNIQUE("channel","period_start","currency")
);
--> statement-breakpoint
CREATE TABLE "growth_journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"user_id" uuid,
	"first_channel" text NOT NULL,
	"first_channel_type" text NOT NULL,
	"first_source" text,
	"first_medium" text,
	"first_campaign" text,
	"first_content" text,
	"first_term" text,
	"first_referrer_host" text,
	"first_landing_path" text,
	"first_ref_code" text,
	"first_link_id" uuid,
	"first_touch_at" timestamp DEFAULT now() NOT NULL,
	"last_channel" text NOT NULL,
	"last_channel_type" text NOT NULL,
	"last_source" text,
	"last_medium" text,
	"last_campaign" text,
	"last_content" text,
	"last_term" text,
	"last_referrer_host" text,
	"last_landing_path" text,
	"last_ref_code" text,
	"last_link_id" uuid,
	"last_touch_at" timestamp DEFAULT now() NOT NULL,
	"first_chat_at" timestamp,
	"signed_up_at" timestamp,
	"newsletter_confirmed_at" timestamp,
	"first_paid_at" timestamp,
	"first_paid_kind" text,
	"retained_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "growth_journeys_lead_id_unique" UNIQUE("lead_id"),
	CONSTRAINT "growth_journeys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "growth_campaign_links" ADD CONSTRAINT "growth_campaign_links_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_journeys" ADD CONSTRAINT "growth_journeys_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_journeys" ADD CONSTRAINT "growth_journeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_journeys" ADD CONSTRAINT "growth_journeys_first_link_id_growth_campaign_links_id_fk" FOREIGN KEY ("first_link_id") REFERENCES "public"."growth_campaign_links"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_journeys" ADD CONSTRAINT "growth_journeys_last_link_id_growth_campaign_links_id_fk" FOREIGN KEY ("last_link_id") REFERENCES "public"."growth_campaign_links"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_growth_campaign_links_source" ON "growth_campaign_links" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_growth_journeys_first_channel" ON "growth_journeys" USING btree ("first_channel");--> statement-breakpoint
CREATE INDEX "idx_growth_journeys_last_channel" ON "growth_journeys" USING btree ("last_channel");--> statement-breakpoint
CREATE INDEX "idx_growth_journeys_first_link" ON "growth_journeys" USING btree ("first_link_id");--> statement-breakpoint
CREATE INDEX "idx_growth_journeys_last_link" ON "growth_journeys" USING btree ("last_link_id");--> statement-breakpoint
CREATE INDEX "idx_growth_journeys_first_touch_at" ON "growth_journeys" USING btree ("first_touch_at");--> statement-breakpoint
-- ─── Backfill: give every existing lead a journey so the funnel has history ───
-- Pre-feature visits carried no UTMs we kept; the only attribution we have is
-- the first referral code a lead used. Everything else starts as "direct".
INSERT INTO "growth_journeys" (
	"lead_id", "first_channel", "first_channel_type", "first_ref_code",
	"last_channel", "last_channel_type", "last_ref_code",
	"first_touch_at", "last_touch_at", "created_at", "updated_at"
)
SELECT
	l."id",
	CASE WHEN rc."code" IS NOT NULL THEN 'ref:' || rc."code" ELSE 'direct' END,
	CASE WHEN rc."code" IS NOT NULL THEN 'enums.channelType.referral' ELSE 'enums.channelType.direct' END,
	rc."code",
	CASE WHEN rc."code" IS NOT NULL THEN 'ref:' || rc."code" ELSE 'direct' END,
	CASE WHEN rc."code" IS NOT NULL THEN 'enums.channelType.referral' ELSE 'enums.channelType.direct' END,
	rc."code",
	l."created_at", l."created_at", now(), now()
FROM "leads" l
LEFT JOIN LATERAL (
	SELECT r."code" FROM "lead_referrals" lr
	JOIN "referral_codes" r ON r."id" = lr."referral_code_id"
	WHERE lr."lead_id" = l."id"
	ORDER BY lr."created_at" ASC
	LIMIT 1
) rc ON true
ON CONFLICT ("lead_id") DO NOTHING;
--> statement-breakpoint
-- Each user inherits exactly one journey: its signup lead, else its oldest linked lead.
UPDATE "growth_journeys" gj
SET "user_id" = pick."user_id", "signed_up_at" = u."created_at"
FROM (
	SELECT DISTINCT ON (ul."user_id") ul."user_id", ul."lead_id"
	FROM "user_lead_links" ul
	ORDER BY ul."user_id", (ul."link_reason" = 'signup') DESC, ul."linked_at" ASC
) pick
JOIN "users" u ON u."id" = pick."user_id"
WHERE gj."lead_id" = pick."lead_id"
	AND NOT EXISTS (SELECT 1 FROM "growth_journeys" o WHERE o."user_id" = pick."user_id");
--> statement-breakpoint
UPDATE "growth_journeys" gj
SET "first_chat_at" = sub."at"
FROM (
	SELECT t."user_id", min(m."created_at") AS "at"
	FROM "chat_messages" m
	JOIN "chat_threads" t ON t."id" = m."thread_id"
	WHERE m."role" = 'user' AND t."user_id" IS NOT NULL
	GROUP BY t."user_id"
) sub
WHERE gj."user_id" = sub."user_id";
--> statement-breakpoint
UPDATE "growth_journeys" gj
SET "first_chat_at" = sub."at"
FROM (
	SELECT t."lead_id", min(m."created_at") AS "at"
	FROM "chat_messages" m
	JOIN "chat_threads" t ON t."id" = m."thread_id"
	WHERE m."role" = 'user' AND t."user_id" IS NULL AND t."lead_id" IS NOT NULL
	GROUP BY t."lead_id"
) sub
WHERE gj."lead_id" = sub."lead_id" AND gj."first_chat_at" IS NULL;
--> statement-breakpoint
UPDATE "growth_journeys" gj
SET "newsletter_confirmed_at" = sub."at"
FROM (
	SELECT "user_id", min("confirmed_at") AS "at"
	FROM "newsletter_subscriptions"
	WHERE "confirmed_at" IS NOT NULL AND "user_id" IS NOT NULL
	GROUP BY "user_id"
) sub
WHERE gj."user_id" = sub."user_id";
--> statement-breakpoint
UPDATE "growth_journeys" gj
SET "newsletter_confirmed_at" = sub."at"
FROM (
	SELECT "lead_id", min("confirmed_at") AS "at"
	FROM "newsletter_subscriptions"
	WHERE "confirmed_at" IS NOT NULL AND "lead_id" IS NOT NULL
	GROUP BY "lead_id"
) sub
WHERE gj."lead_id" = sub."lead_id" AND gj."newsletter_confirmed_at" IS NULL;
--> statement-breakpoint
UPDATE "growth_journeys" gj
SET
	"first_paid_at" = sub."at",
	"first_paid_kind" = CASE WHEN sub."mode" = 'enums.checkoutMode.subscription'
		THEN 'enums.paidKind.subscription' ELSE 'enums.paidKind.pack' END
FROM (
	SELECT DISTINCT ON ("user_id") "user_id", "created_at" AS "at", "mode"
	FROM "payment_transactions"
	WHERE "status" = 'enums.paymentStatus.succeeded'
	ORDER BY "user_id", "created_at" ASC
) sub
WHERE gj."user_id" = sub."user_id";
