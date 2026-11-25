import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { LeadSource } from "next-vibe/identity/lead/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import definition, { type LeadGetResponseOutput } from "./definition";
import { LeadAccountAssociation, LeadJourneyEvent } from "./enum";
import type { LeadDetailRepository as LeadDetailRepositoryType } from "./repository";

const pg = new PGlite();
const db = drizzle(pg);
const { lead } = definition.GET.responseSchema.parse(definition.GET.examples.responses?.default);
const primary = lead.basicInfo.id;
const related = lead.linkedLeads[0].linkedLeadId;
const outside = "550e8400-e29b-41d4-a716-446655440099";
const linkedAccount = "123e4567-e89b-12d3-a456-426614174001";
const conversionAccount = "123e4567-e89b-12d3-a456-426614174002";
const attributedAccount = "123e4567-e89b-12d3-a456-426614174003";
const outsideAccount = "123e4567-e89b-12d3-a456-426614174004";
const optOutAt = "2024-01-20T11:15:00.000Z";

mock.module("next-vibe/database", () => ({ db }));
mock.module("next-vibe/identity/lead/repository", () => ({
  LeadsRepository: {
    getLeadById: async (): Promise<ResponseType<LeadGetResponseOutput>> => success({ lead }),
  },
}));

let LeadDetailRepository: typeof LeadDetailRepositoryType;
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  ({ LeadDetailRepository } = await import("./repository"));
  await pg.exec(`
    CREATE TABLE leads (
      id uuid PRIMARY KEY, source text NOT NULL,
      converted_user_id uuid, converted_at timestamp,
      uncensored_consent_at timestamp, uncensored_consent_version integer,
      created_at timestamp, signed_up_at timestamp, geo_country text, country text,
      email text, business_name text, device_type text, browser text, os text,
      ip_address text, user_agent text, referral_code text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    );
    CREATE TABLE growth_journeys (
      lead_id uuid PRIMARY KEY, user_id uuid,
      first_touch_at timestamp NOT NULL, first_channel text NOT NULL,
      first_source text, first_campaign text,
      last_touch_at timestamp NOT NULL, last_channel text NOT NULL,
      last_source text, last_campaign text,
      first_chat_at timestamp, first_paid_at timestamp, signed_up_at timestamp,
      first_channel_type text, first_medium text, first_referrer_host text,
      first_landing_path text, first_ref_code text
    );
    CREATE TABLE user_lead_links (
      lead_id uuid, user_id uuid, link_reason text NOT NULL, linked_at timestamp NOT NULL
    );
    CREATE TABLE users (
      id uuid PRIMARY KEY, email text NOT NULL, public_name text NOT NULL,
      created_at timestamp, email_verified boolean
    );
    CREATE TABLE chat_threads (lead_id uuid, user_id uuid, created_at timestamp);
    CREATE TABLE payment_transactions (user_id uuid, amount numeric, status text, created_at timestamp);
    CREATE TABLE credit_transactions (wallet_id uuid, type text, metadata jsonb);
    CREATE TABLE lead_engagements (
      id uuid, lead_id uuid, campaign_id uuid, timestamp timestamp, engagement_type text
    );
    CREATE TABLE email_campaigns (
      id uuid, lead_id uuid, subject text, status text, scheduled_at timestamp,
      sent_at timestamp, bounced_at timestamp, created_at timestamp
    );
    CREATE TABLE credit_wallets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id uuid, user_id uuid
    );
    CREATE TABLE newsletter_subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL,
      lead_id uuid, user_id uuid, status text, marketing_consent boolean,
      subscription_date timestamptz NOT NULL DEFAULT now(),
      confirmed_at timestamptz, unsubscribed_date timestamptz
    );
  `);
  await pg.query(
    `INSERT INTO leads (id, source, converted_user_id, converted_at)
     VALUES ($1, $4, NULL, NULL), ($2, $4, $5, $6), ($3, $4, NULL, NULL)`,
    [primary, related, outside, LeadSource.WEBSITE, conversionAccount, optOutAt],
  );
  await pg.query(
    `INSERT INTO growth_journeys (lead_id, user_id, first_touch_at, first_channel, last_touch_at, last_channel)
     VALUES ($1, $2, $3, 'direct', $3, 'direct')`,
    [related, attributedAccount, optOutAt],
  );
  await pg.query(
    `INSERT INTO user_lead_links (lead_id, user_id, link_reason, linked_at)
     VALUES ($1, $2, 'signup', $5), ($3, $2, 'login', $5), ($3, $4, 'signup', $5)`,
    [related, linkedAccount, outside, outsideAccount, optOutAt],
  );
  await pg.query(
    `INSERT INTO users (id, email, public_name) VALUES
     ($1, 'linked@example.invalid', 'Linked account'),
     ($2, 'converted@example.invalid', 'Conversion account'),
     ($3, 'attributed@example.invalid', 'Attribution account'),
     ($4, 'unrelated@example.invalid', 'Unrelated account')`,
    [linkedAccount, conversionAccount, attributedAccount, outsideAccount],
  );
  await pg.query(
    `INSERT INTO credit_wallets (lead_id, user_id) VALUES
     (NULL, $1), (NULL, $2), (NULL, $3), (NULL, $4), ($5, NULL)`,
    [linkedAccount, conversionAccount, attributedAccount, outsideAccount, outside],
  );
  await pg.query(
    `INSERT INTO newsletter_subscriptions
       (email, lead_id, user_id, status, marketing_consent, unsubscribed_date)
     VALUES
       ('linked@example.invalid', NULL, $1, $4, false, $5),
       ('unrelated@example.invalid', NULL, $2, $4, false, $5),
       ('outside-lead@example.invalid', $3, NULL, $4, false, $5),
       ('outside-lead-same-user@example.invalid', $3, $1, $4, false, $5)`,
    [linkedAccount, outsideAccount, outside, NewsletterSubscriptionStatus.UNSUBSCRIBED, optOutAt],
  );
});

afterAll(async () => {
  await pg.close();
});

test("finds user-only records through direct associations without traversing accounts to other leads", async () => {
  const result = await LeadDetailRepository.getLead(primary, logger, defaultLocale);
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const { review } = definition.GET.responseSchema.parse(result.data);
  expect(
    review?.accountAssociations?.map(({ leadId, userId, association, publicName }) => ({
      leadId,
      userId,
      association,
      publicName,
    })),
  ).toEqual([
    {
      leadId: related,
      userId: linkedAccount,
      association: LeadAccountAssociation.LINK,
      publicName: "Linked account",
    },
    {
      leadId: related,
      userId: conversionAccount,
      association: LeadAccountAssociation.CONVERSION,
      publicName: "Conversion account",
    },
    {
      leadId: related,
      userId: attributedAccount,
      association: LeadAccountAssociation.ATTRIBUTION,
      publicName: "Attribution account",
    },
  ]);
  expect(
    review?.wallets
      .map(({ leadId, userId }) => ({ leadId, userId }))
      .toSorted((a, b) => (a.userId ?? "").localeCompare(b.userId ?? "")),
  ).toEqual([
    { leadId: null, userId: linkedAccount },
    { leadId: null, userId: conversionAccount },
    { leadId: null, userId: attributedAccount },
  ]);
  expect(
    review?.newsletter.map(({ leadId, userId, email, unsubscribedDate }) => ({
      leadId,
      userId,
      email,
      unsubscribedDate: unsubscribedDate?.toISOString(),
    })),
  ).toEqual([
    {
      leadId: null,
      userId: linkedAccount,
      email: "linked@example.invalid",
      unsubscribedDate: optOutAt,
    },
  ]);
  expect(review?.events.some(({ kind }) => kind === LeadJourneyEvent.NEWSLETTER_UNSUBSCRIBED)).toBe(
    false,
  );
  expect(review?.events.some(({ kind }) => kind === LeadJourneyEvent.FIRST_TOUCH)).toBe(false);
});
