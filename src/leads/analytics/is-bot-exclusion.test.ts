import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { GraphResolution } from "next-vibe/dataflow/enum";
import { EngagementTypes, LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import { BotFamily, TrafficFilter } from "./enum";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));

const id = (n: number): string =>
  `00000000-0000-4000-9000-${n.toString().padStart(12, "0")}`;

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE users (
      id uuid PRIMARY KEY,
      created_at timestamp NOT NULL DEFAULT now(),
      email_verified boolean NOT NULL DEFAULT false,
      email text,
      creator_slug text
    );
    CREATE TABLE leads (
      id uuid PRIMARY KEY,
      email text UNIQUE,
      business_name text NOT NULL DEFAULT '',
      contact_name text,
      phone text,
      website text,
      country text NOT NULL DEFAULT 'US',
      language text NOT NULL DEFAULT 'en',
      ip_address text,
      geo_country text,
      user_agent text,
      device_type text,
      browser text,
      os text,
      is_bot boolean NOT NULL DEFAULT false,
      referral_code text,
      skill_id text,
      status text NOT NULL DEFAULT '${LeadStatus.WEBSITE_USER}',
      source text NOT NULL DEFAULT '${LeadSource.WEBSITE}',
      notes text,
      uncensored_consent_at timestamp,
      uncensored_consent_version integer,
      converted_user_id uuid,
      converted_at timestamp,
      signed_up_at timestamp,
      subscription_confirmed_at timestamp,
      bounced_at timestamp,
      invalid_at timestamp,
      current_campaign_stage text DEFAULT 'enums.emailCampaignStage.notStarted',
      email_journey_variant text,
      campaign_started_at timestamp,
      emails_sent integer NOT NULL DEFAULT 0,
      last_email_sent_at timestamp,
      unsubscribed_at timestamp,
      emails_opened integer NOT NULL DEFAULT 0,
      emails_clicked integer NOT NULL DEFAULT 0,
      last_engagement_at timestamp,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE lead_lead_links (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id_1 uuid NOT NULL,
      lead_id_2 uuid NOT NULL,
      link_reason text NOT NULL,
      linked_at timestamp NOT NULL DEFAULT now(),
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE user_lead_links (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      lead_id uuid NOT NULL,
      link_reason text NOT NULL,
      linked_at timestamp NOT NULL DEFAULT now(),
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE lead_engagements (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid NOT NULL,
      campaign_id uuid,
      engagement_type text NOT NULL,
      ip_address text,
      user_agent text,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      timestamp timestamp NOT NULL DEFAULT now(),
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE growth_journeys (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid NOT NULL UNIQUE,
      user_id uuid UNIQUE,
      first_channel text NOT NULL DEFAULT 'direct',
      first_channel_type text NOT NULL DEFAULT 'enums.channelType.direct',
      first_source text,
      first_medium text,
      first_campaign text,
      first_content text,
      first_term text,
      first_referrer_host text,
      first_landing_path text,
      first_ref_code text,
      first_link_id uuid,
      first_touch_at timestamp NOT NULL DEFAULT now(),
      last_channel text NOT NULL DEFAULT 'direct',
      last_channel_type text NOT NULL DEFAULT 'enums.channelType.direct',
      last_source text,
      last_medium text,
      last_campaign text,
      last_content text,
      last_term text,
      last_referrer_host text,
      last_landing_path text,
      last_ref_code text,
      last_link_id uuid,
      last_touch_at timestamp NOT NULL DEFAULT now(),
      first_chat_at timestamp,
      signed_up_at timestamp,
      newsletter_confirmed_at timestamp,
      first_paid_at timestamp,
      first_paid_kind text,
      retained_at timestamp,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE growth_visits (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid NOT NULL,
      visited_at timestamp NOT NULL,
      source text,
      medium text,
      campaign text,
      content text,
      referrer_host text,
      ref_code text,
      geo_country text
    );
    CREATE TABLE crawler_visits (
      bucket_hour timestamp NOT NULL,
      bot_family text NOT NULL,
      visit_count integer NOT NULL DEFAULT 0,
      PRIMARY KEY (bucket_hour, bot_family)
    );
    CREATE TABLE chat_threads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid,
      user_id uuid,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE chat_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      thread_id uuid NOT NULL,
      role text NOT NULL,
      is_ai boolean NOT NULL DEFAULT false,
      author_id text,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE payment_transactions (
      user_id uuid,
      amount numeric,
      currency text,
      status text,
      mode text DEFAULT 'enums.checkoutMode.subscription',
      created_at timestamp
    );
    CREATE TABLE referral_codes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      code text UNIQUE,
      owner_user_id uuid
    );
    CREATE TABLE lead_referrals (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid NOT NULL,
      referral_code_id uuid NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE user_referrals (
      referred_user_id uuid NOT NULL,
      referral_code_id uuid NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE custom_skills (user_id uuid);
    CREATE TABLE credit_wallets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid,
      lead_id uuid,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE credit_transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_id uuid NOT NULL,
      amount numeric NOT NULL,
      type text NOT NULL,
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE free_pool_claims (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      kind text NOT NULL,
      subnet text NOT NULL,
      period text NOT NULL,
      pool_key text NOT NULL,
      granted boolean NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE anti_farming_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      kind text NOT NULL,
      subnet text,
      email_domain text,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);

  const nowTs = new Date().toISOString().replace("T", " ").slice(0, 19);
  await pg.exec(`
    INSERT INTO leads (id, business_name, email, status, source, ip_address, user_agent, is_bot, created_at, updated_at) VALUES
      ('${id(1)}', 'Human Lead', 'human@example.test', '${LeadStatus.WEBSITE_USER}', '${LeadSource.WEBSITE}', '198.51.100.1', 'Mozilla/5.0 Chrome/142.0 Safari/537.36', false, '${nowTs}', '${nowTs}'),
      ('${id(2)}', 'Human Linked Guest', NULL, '${LeadStatus.WEBSITE_USER}', '${LeadSource.WEBSITE}', '198.51.100.1', 'Mozilla/5.0 Chrome/142.0 Safari/537.36', false, '${nowTs}', '${nowTs}'),
      ('${id(3)}', '', NULL, '${LeadStatus.WEBSITE_USER}', '${LeadSource.WEBSITE}', '66.249.66.1', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', true, '${nowTs}', '${nowTs}'),
      ('${id(4)}', '', NULL, '${LeadStatus.IN_CONTACT}', '${LeadSource.WEBSITE}', '57.141.20.10', 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)', true, '${nowTs}', '${nowTs}');
    INSERT INTO lead_lead_links (lead_id_1, lead_id_2, link_reason) VALUES
      ('${id(1)}', '${id(2)}', 'ip_match'),
      ('${id(1)}', '${id(3)}', 'ip_match');
    INSERT INTO lead_engagements (lead_id, engagement_type, timestamp, created_at) VALUES
      ('${id(1)}', '${EngagementTypes.WEBSITE_VISIT}', '${nowTs}', '${nowTs}'),
      ('${id(3)}', '${EngagementTypes.WEBSITE_VISIT}', '${nowTs}', '${nowTs}'),
      ('${id(4)}', '${EngagementTypes.FORM_SUBMIT}', '${nowTs}', '${nowTs}');
    INSERT INTO growth_journeys (lead_id, first_touch_at) VALUES
      ('${id(1)}', '${nowTs}'),
      ('${id(3)}', '${nowTs}');
    INSERT INTO credit_wallets (id, lead_id, created_at) VALUES
      ('${id(501)}', '${id(1)}', '${nowTs}'),
      ('${id(502)}', '${id(3)}', '${nowTs}');
    INSERT INTO free_pool_claims (kind, subnet, period, pool_key, granted, created_at) VALUES
      ('guest', '198.51.100.0/24', '2026-11-27', 'lead:${id(1)}', true, '${nowTs}'),
      ('guest', '66.249.66.0/24', '2026-11-27', 'lead:${id(3)}', true, '${nowTs}');
  `);
});

afterAll(async () => {
  await pg.close();
});

test("leads list hides is_bot leads by default and shows them with includeBots or bot filters", async () => {
  const { LeadsListRepository } = await import("@/leads/list/repository");
  const { default: listDef } = await import("@/leads/list/definition");
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = listDef.GET.scopedTranslation.scopedT(defaultLocale);

  const defaultResult = await LeadsListRepository.listLeads(
    listDef.GET.requestSchema.parse({}),
    t,
    logger,
    defaultLocale,
  );
  expect(defaultResult.success).toBe(true);
  if (!defaultResult.success) {
    return;
  }
  expect(defaultResult.data.paginationInfo.totalCount).toBe(2);
  expect(defaultResult.data.response.leads.map((l) => l.id).toSorted()).toEqual(
    [id(1), id(2)],
  );
  // linkedLeadsCount excludes the flagged Googlebot lead linked to id(1)
  const lead1 = defaultResult.data.response.leads.find((l) => l.id === id(1));
  expect(lead1?.linkedLeadsCount).toBe(1);
  // countsByStatus excludes the flagged Meta IN_CONTACT lead
  expect(defaultResult.data.countsByStatus?.inContact).toBe(0);
  expect(defaultResult.data.countsByStatus?.websiteUser).toBe(2);

  // Opt-in via includeBots: true shows all 4 leads
  const withBots = await LeadsListRepository.listLeads(
    listDef.GET.requestSchema.parse({ includeBots: true }),
    t,
    logger,
    defaultLocale,
  );
  expect(withBots.success).toBe(true);
  if (withBots.success) {
    expect(withBots.data.paginationInfo.totalCount).toBe(4);
    expect(withBots.data.countsByStatus?.inContact).toBe(1);
    const botRow = withBots.data.response.leads.find((l) => l.id === id(3));
    expect(botRow?.isBot).toBe(true);
  }

  // Opt-in via traffic=BOTS or botFamily=GOOGLE shows matching bots
  const googleOnly = await LeadsListRepository.listLeads(
    listDef.GET.requestSchema.parse({ botFamily: BotFamily.GOOGLE }),
    t,
    logger,
    defaultLocale,
  );
  expect(googleOnly.success).toBe(true);
  if (googleOnly.success) {
    expect(googleOnly.data.response.leads.map((l) => l.id)).toEqual([id(3)]);
  }

  const botsOnly = await LeadsListRepository.listLeads(
    listDef.GET.requestSchema.parse({ traffic: TrafficFilter.BOTS }),
    t,
    logger,
    defaultLocale,
  );
  expect(botsOnly.success).toBe(true);
  if (botsOnly.success) {
    expect(botsOnly.data.response.leads.map((l) => l.id).toSorted()).toEqual([
      id(3),
      id(4),
    ]);
  }
});

test("leads dashboard, data sources, guest pools and credit reports exclude is_bot leads", async () => {
  const { LeadsDashboardRepository } =
    await import("@/leads/dashboard/repository");
  const { default: dashDef } = await import("@/leads/dashboard/definition");
  const { guestPoolLeadIdsSql } = await import("@/credits/pool-members");
  const { db } = await import("next-vibe/database");
  const { QueryLeadsCreatedRepository } =
    await import("@/leads/data-sources/leads-created/repository");
  const { QueryLeadsInContactRepository } =
    await import("@/leads/data-sources/leads-in-contact/repository");
  const { QueryLeadsWebsiteVisitsRepository } =
    await import("@/leads/data-sources/leads-website-visits/repository");
  const { QueryLeadsFormSubmitsRepository } =
    await import("@/leads/data-sources/leads-form-submits/repository");
  const { GrowthFunnelStepRepository } =
    await import("@/leads/growth/data-sources/funnel-step/repository");
  const { AttributionTouch, ChannelTypeFilter, FunnelStep } =
    await import("@/leads/growth/enum");
  const { QueryCreditsWalletsTotalRepository } =
    await import("@/credits/data-sources/credits-wallets-total/repository");
  const { AntiFarmingReportRepository } =
    await import("@/credits/anti-farming/report/repository");

  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = dashDef.GET.scopedTranslation.scopedT(defaultLocale);

  // Dashboard excludes flagged crawler leads from all business counts
  const dash = await LeadsDashboardRepository.getDashboard(logger, t);
  expect(dash.success).toBe(true);
  if (dash.success) {
    expect(dash.data.totalLeadsCount).toBe(2);
    expect(dash.data.activeLeadsCount).toBe(2);
    expect(dash.data.newThisWeekCount).toBe(2);
    expect(dash.data.statusBreakdown[LeadStatus.IN_CONTACT]).toBeUndefined();
    // SEO/crawl analytics metric still sees the 2 bot leads
    expect(dash.data.last7Days.botLeads.value).toBe(2);
  }

  // Guest pool traversal never pulls flagged bot leads into a human guest pool
  const poolRows = await db.execute<{ lead_id: string }>(
    guestPoolLeadIdsSql(id(1)),
  );
  expect(poolRows.rows.map((r) => r.lead_id).toSorted()).toEqual([
    id(1),
    id(2),
  ]);

  const now = new Date();
  const range = {
    from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    to: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  };

  // Lead data sources exclude flagged crawler leads
  const created = await QueryLeadsCreatedRepository.queryLeadsCreated({
    resolution: GraphResolution.ONE_DAY,
    range,
  });
  expect(
    created.success && created.data.result.reduce((s, p) => s + p.value, 0),
  ).toBe(2);

  const inContact = await QueryLeadsInContactRepository.queryLeadsInContact({
    resolution: GraphResolution.ONE_DAY,
    range,
  });
  expect(
    inContact.success && inContact.data.result.every((p) => p.value === 0),
  ).toBe(true);

  const visits =
    await QueryLeadsWebsiteVisitsRepository.queryLeadsWebsiteVisits({
      resolution: GraphResolution.ONE_DAY,
      range,
    });
  expect(
    visits.success && visits.data.result.reduce((s, p) => s + p.value, 0),
  ).toBe(1);

  const formSubmits =
    await QueryLeadsFormSubmitsRepository.queryLeadsFormSubmits({
      resolution: GraphResolution.ONE_DAY,
      range,
    });
  expect(
    formSubmits.success &&
      formSubmits.data.result.reduce((s, p) => s + p.value, 0),
  ).toBe(0);

  // Growth funnel step excludes flagged crawler journeys
  const funnelVisit = await GrowthFunnelStepRepository.query({
    resolution: GraphResolution.ONE_DAY,
    range,
    step: FunnelStep.VISIT,
    touch: AttributionTouch.FIRST,
    channelType: ChannelTypeFilter.ALL,
    channel: "",
  });
  expect(
    funnelVisit.success &&
      funnelVisit.data.result.reduce((s, p) => s + p.value, 0),
  ).toBe(1);

  // Credit wallets total excludes flagged bot wallets
  const wallets =
    await QueryCreditsWalletsTotalRepository.queryCreditsWalletsTotal({
      resolution: GraphResolution.ONE_DAY,
      range,
    });
  expect(
    wallets.success && wallets.data.result.at(-1)?.value,
  ).toBe(1);

  // Anti-farming guest pool claims report excludes flagged bot leads
  const afReport = await AntiFarmingReportRepository.getReport(
    { days: 7 },
    logger,
    defaultLocale,
  );
  expect(afReport.success).toBe(true);
  if (afReport.success) {
    expect(afReport.data.subnetsByClaims.map((s) => s.subnet)).toEqual([
      "198.51.100.0/24",
    ]);
  }
});
