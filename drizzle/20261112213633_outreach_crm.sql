-- Outreach CRM: contacts pitched (one row per lowercased email), every email in
-- either direction, and paid deals linked to the growth funnel by campaign
-- link / utm_campaign / ref code / channel.
-- Hand-added CHECKs (not in the Drizzle schema, so dgen never drops them):
-- emails are stored lowercased + trimmed, and counters / amounts never go
-- negative. Deals RESTRICT contact deletion so money records survive.
CREATE TABLE "outreach_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"kind" text DEFAULT 'enums.contactKind.other' NOT NULL,
	"url" text,
	"angle" text,
	"status" text DEFAULT 'enums.contactStatus.sent' NOT NULL,
	"first_contact_at" timestamp,
	"last_contact_at" timestamp,
	"last_reply_at" timestamp,
	"last_subject" text,
	"contact_count" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"ref_code" text,
	"campaign_link_id" uuid,
	"channel" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "outreach_contacts_email_unique" UNIQUE("email"),
	CONSTRAINT "outreach_contacts_email_normalized" CHECK ("email" = lower(btrim("email"))),
	CONSTRAINT "outreach_contacts_contact_count_nonnegative" CHECK ("contact_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "outreach_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"deliverable" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'enums.dealStatus.proposed' NOT NULL,
	"channel" text,
	"campaign_link_id" uuid,
	"utm_campaign" text,
	"ref_code" text,
	"notes" text,
	"live_at" timestamp,
	"committed_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "outreach_deals_amount_nonnegative" CHECK ("amount_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "outreach_touches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"at" timestamp NOT NULL,
	"direction" text NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"angle" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "outreach_contacts" ADD CONSTRAINT "outreach_contacts_campaign_link_id_growth_campaign_links_id_fk" FOREIGN KEY ("campaign_link_id") REFERENCES "public"."growth_campaign_links"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_deals" ADD CONSTRAINT "outreach_deals_contact_id_outreach_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."outreach_contacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_deals" ADD CONSTRAINT "outreach_deals_campaign_link_id_growth_campaign_links_id_fk" FOREIGN KEY ("campaign_link_id") REFERENCES "public"."growth_campaign_links"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_touches" ADD CONSTRAINT "outreach_touches_contact_id_outreach_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."outreach_contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_outreach_contacts_status" ON "outreach_contacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_outreach_contacts_last_contact_at" ON "outreach_contacts" USING btree ("last_contact_at");--> statement-breakpoint
CREATE INDEX "idx_outreach_deals_contact" ON "outreach_deals" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_outreach_touches_contact_at" ON "outreach_touches" USING btree ("contact_id","at");