/**
 * Newsletter "never twice" guarantees.
 *
 * - One address spread over a user, a differently-cased subscription and
 *   three leads in three locales gets exactly ONE mail, in ONE locale
 *   (account locale wins).
 * - Running the blast twice sends nothing the second time and reports the
 *   address as already sent.
 * - Concurrent dispatch of the same pending row(s) sends once.
 * - The send-log claim itself is atomic under concurrency.
 *
 * SMTP is mocked (asserted before any dispatch), the DB is the real dev DB.
 * Every row is scoped to unique *.invalid test addresses and the dispatcher /
 * blast are scoped to those rows, so no real contact is touched or mailed.
 */

import { eq, inArray, or } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import {
  emailCampaigns,
  emailSendLog,
  leads,
} from "next-vibe/identity/lead/db";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadSource,
  LeadStatus,
} from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";

import { CampaignType } from "@/messenger/accounts/enum";
import { MessageStatus } from "@/messenger/messages/enum";
import * as smtpSending from "@/messenger/providers/email/smtp-client/sending/repository";

import { newsletterSubscriptions } from "../../../../newsletter/db";
import { NewsletterSubscriptionStatus } from "../../../../newsletter/enum";
import { scopedTranslation as emailCampaignsScopedTranslation } from "../../email-campaigns/i18n";
import { EmailCampaignsRepository } from "../../email-campaigns/repository";
import { campaignSchedulerService, normalizeEmail } from "./scheduler";

interface SentMail {
  to: string;
  campaignId: string | undefined;
  language: string | undefined;
  country: string | undefined;
}
const sentMails: SentMail[] = [];

const mockSendEmail = vi.fn(
  (data: {
    to: string;
    campaignId?: string;
    selectionCriteria: { language?: string; country?: string };
  }) => {
    sentMails.push({
      to: data.to,
      campaignId: data.campaignId,
      language: data.selectionCriteria.language,
      country: data.selectionCriteria.country,
    });
    return Promise.resolve(
      success({
        messageId: `mock-${sentMails.length}`,
        accountId: null,
        accountName: "mock",
        response: "250 mock",
        sentAt: new Date().toISOString(),
      }),
    );
  },
);

vi.mock("@/messenger/providers/email/smtp-client/sending/repository", () => ({
  SmtpSendingRepository: { sendEmail: mockSendEmail },
}));

const VARIANT = EmailJourneyVariant.NEWSLETTER_NOV_2026;
const STAGE = EmailCampaignStage.INITIAL;
const LOCALE: CountryLanguage = "en-GLOBAL";
const logger = createEndpointLogger(false, LOCALE);
const campaignsT = emailCampaignsScopedTranslation.scopedT(LOCALE).t;

const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const addr = (name: string): string =>
  `nl-once-${RUN}-${name}@example-test.invalid`;
const MULTI = addr("multi");
const RACE = addr("race");
const CLAIM = addr("claim");
const ALL_KEYS = [MULTI, RACE, CLAIM].map(normalizeEmail);

const leadIds: string[] = [];
const multiLeadIds: string[] = [];
const raceLeadIds: string[] = [];
const userIds: string[] = [];

function assertSmtpMocked(): void {
  // Hard stop: never dispatch unless SMTP is the mock.
  expect(smtpSending.SmtpSendingRepository.sendEmail).toBe(mockSendEmail);
}

async function makeLead(values: {
  email: string | null;
  language: "en" | "de" | "pl";
  country: "GLOBAL" | "DE" | "PL" | "US";
  convertedUserId?: string;
}): Promise<string> {
  const [lead] = await db
    .insert(leads)
    .values({
      email: values.email,
      businessName: "",
      language: values.language,
      country: values.country,
      status: LeadStatus.SIGNED_UP,
      source: LeadSource.WEBSITE,
      convertedUserId: values.convertedUserId ?? null,
    })
    .returning({ id: leads.id });
  leadIds.push(lead.id);
  return lead.id;
}

async function makeConsentedUser(
  email: string,
  locale: CountryLanguage,
): Promise<string> {
  const [user] = await db
    .insert(users)
    .values({
      email,
      password: "x",
      privateName: "Test",
      publicName: "Test",
      locale,
      emailVerified: true,
      marketingConsent: true,
    })
    .returning({ id: users.id });
  userIds.push(user.id);
  return user.id;
}

async function makePendingRow(leadId: string): Promise<string> {
  const [row] = await db
    .insert(emailCampaigns)
    .values({
      leadId,
      campaignType: CampaignType.NEWSLETTER,
      stage: STAGE,
      journeyVariant: VARIANT,
      subject: `${VARIANT}_${STAGE}`,
      templateName: `${VARIANT}_${STAGE}`,
      scheduledAt: new Date(Date.now() - 60_000),
      status: MessageStatus.PENDING,
    })
    .returning({ id: emailCampaigns.id });
  return row.id;
}

async function rowsFor(ids: string[]): Promise<
  Array<{
    id: string;
    status: string;
    error: string | null;
  }>
> {
  return await db
    .select({
      id: emailCampaigns.id,
      status: emailCampaigns.status,
      error: emailCampaigns.error,
    })
    .from(emailCampaigns)
    .where(inArray(emailCampaigns.leadId, ids));
}

async function dispatch(campaignIds: string[]): Promise<{
  sent: number;
  duplicates: number;
}> {
  assertSmtpMocked();
  const stage = await EmailCampaignsRepository.processStage(
    STAGE,
    { batchSize: 50, dryRun: false, journeyVariant: VARIANT, campaignIds },
    campaignsT,
    logger,
  );
  expect(stage.success).toBe(true);
  return stage.success
    ? { sent: stage.data.emailsSent, duplicates: stage.data.duplicatesSkipped }
    : { sent: 0, duplicates: 0 };
}

async function campaignIdsForLeads(ids: string[]): Promise<string[]> {
  const rows = await db
    .select({ id: emailCampaigns.id })
    .from(emailCampaigns)
    .where(inArray(emailCampaigns.leadId, ids));
  return rows.map((r) => r.id);
}

beforeAll(async () => {
  // One person, five records, three locales:
  // account (de-DE), subscription with different casing, leads in pl-PL,
  // en-US (cased differently) and an email-less lead linked to the account.
  const userId = await makeConsentedUser(MULTI, "de-DE");
  multiLeadIds.push(
    await makeLead({
      email: MULTI,
      language: "pl",
      country: "PL",
      convertedUserId: userId,
    }),
  );
  const upperLead = await makeLead({
    email: MULTI.toUpperCase(),
    language: "en",
    country: "US",
  });
  const linkedLead = await makeLead({
    email: null,
    language: "en",
    country: "GLOBAL",
    convertedUserId: userId,
  });
  multiLeadIds.push(upperLead, linkedLead);
  await db.insert(newsletterSubscriptions).values({
    email: MULTI.toUpperCase(),
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    confirmedAt: new Date(),
    marketingConsent: true,
    leadId: upperLead,
  });
  // Old fan-out: one pending row per lead for the same newsletter.
  await makePendingRow(upperLead);
  await makePendingRow(linkedLead);

  // Race: a consented subscriber with the same address on two leads.
  const raceLeadA = await makeLead({
    email: RACE,
    language: "en",
    country: "GLOBAL",
  });
  const raceLeadB = await makeLead({
    email: RACE.toUpperCase(),
    language: "de",
    country: "DE",
  });
  await db.insert(newsletterSubscriptions).values({
    email: RACE,
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    confirmedAt: new Date(),
    marketingConsent: true,
    leadId: raceLeadA,
  });
  raceLeadIds.push(raceLeadA, raceLeadB);
  await makePendingRow(raceLeadA);
  await makePendingRow(raceLeadB);
}, 60_000);

afterAll(async () => {
  await db
    .delete(emailSendLog)
    .where(inArray(emailSendLog.email, ALL_KEYS));
  await db
    .delete(newsletterSubscriptions)
    .where(
      or(
        inArray(newsletterSubscriptions.email, [MULTI, RACE]),
        inArray(newsletterSubscriptions.email, [
          MULTI.toUpperCase(),
          RACE.toUpperCase(),
        ]),
      ),
    );
  if (leadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, leadIds));
  }
  if (userIds.length > 0) {
    await db.delete(users).where(inArray(users.id, userIds));
  }
}, 60_000);

describe("newsletter is sent at most once per address", () => {
  it("audience has one entry per address, in the account locale", async () => {
    const audience =
      await campaignSchedulerService.getConsentedNewsletterAudience();
    const multi = audience.filter((r) => r.key === normalizeEmail(MULTI));
    expect(multi).toHaveLength(1);
    expect(multi[0]?.locale).toBe("de-DE");

    const race = audience.filter((r) => r.key === normalizeEmail(RACE));
    expect(race).toHaveLength(1);
    // No account: the subscription's lead locale.
    expect(race[0]?.locale).toBe("en-GLOBAL");
  }, 60_000);

  it("same address in 3 locales gets exactly one mail, in one locale", async () => {
    const blast =
      await campaignSchedulerService.bootstrapConsentedNewsletterBlast(
        VARIANT,
        logger,
        { onlyEmails: [MULTI] },
      );
    expect(blast.audience).toBe(1);
    // Two old pending rows for one address: one kept, one marked duplicate.
    expect(blast.alreadyPending).toBe(1);
    expect(blast.duplicates).toBe(1);
    expect(blast.scheduled).toBe(0);
    expect(blast.byLocale).toEqual({ "de-DE": 1 });

    sentMails.length = 0;
    const result = await dispatch(await campaignIdsForLeads(multiLeadIds));
    const toMulti = sentMails.filter(
      (m) => normalizeEmail(m.to) === normalizeEmail(MULTI),
    );
    expect(toMulti).toHaveLength(1);
    expect(toMulti[0]?.language).toBe("de");
    expect(toMulti[0]?.country).toBe("DE");
    expect(result.sent).toBeGreaterThanOrEqual(1);

    const [log] = await db
      .select()
      .from(emailSendLog)
      .where(eq(emailSendLog.email, normalizeEmail(MULTI)));
    expect(log?.status).toBe(MessageStatus.SENT);
    expect(log?.locale).toBe("de-DE");
  }, 120_000);

  it("running the blast twice sends nothing the second time", async () => {
    const again =
      await campaignSchedulerService.bootstrapConsentedNewsletterBlast(
        VARIANT,
        logger,
        { onlyEmails: [MULTI] },
      );
    expect(again.alreadySent).toBe(1);
    expect(again.scheduled).toBe(0);
    expect(again.alreadyPending).toBe(0);

    // Even a forged extra pending row for the address is refused at send.
    const [extraLead] = multiLeadIds;
    const forged = await makePendingRowForce(extraLead);
    sentMails.length = 0;
    const result = await dispatch([forged]);
    expect(sentMails).toHaveLength(0);
    expect(result.sent).toBe(0);
    expect(result.duplicates).toBe(1);
    const [row] = await db
      .select({ status: emailCampaigns.status, error: emailCampaigns.error })
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, forged));
    expect(row?.status).toBe(MessageStatus.FAILED);
    expect(row?.error).toBe("duplicate:already_sent");
  }, 120_000);

  it("concurrent dispatch of the same rows sends once", async () => {
    const raceRows = (await rowsFor(raceLeadIds)).filter(
      (r) => r.status === MessageStatus.PENDING,
    );
    // Both race rows (two leads, one address) are still pending.
    expect(raceRows.length).toBe(2);
    const ids = raceRows.map((r) => r.id);

    sentMails.length = 0;
    await Promise.all([dispatch(ids), dispatch(ids), dispatch(ids)]);
    const toRace = sentMails.filter(
      (m) => normalizeEmail(m.to) === normalizeEmail(RACE),
    );
    expect(toRace).toHaveLength(1);

    const after = await db
      .select({ status: emailCampaigns.status })
      .from(emailCampaigns)
      .where(inArray(emailCampaigns.id, ids));
    expect(
      after.filter((r) => r.status === MessageStatus.SENT).length,
    ).toBe(1);
  }, 120_000);

  it("send-log claim is atomic: 10 parallel claims, one winner", async () => {
    const claims = await Promise.all(
      Array.from({ length: 10 }, () =>
        campaignSchedulerService.claimSend(
          {
            journeyVariant: VARIANT,
            stage: STAGE,
            email: CLAIM,
            campaignId: null,
            leadId: null,
            locale: LOCALE,
          },
          logger,
        ),
      ),
    );
    expect(claims.filter((c) => c === "claimed")).toHaveLength(1);

    // A failed attempt (never reached SMTP) may be claimed again, once.
    await campaignSchedulerService.settleSendClaim(
      { journeyVariant: VARIANT, stage: STAGE, email: CLAIM },
      { sent: false, error: "smtp down" },
    );
    const retry = await Promise.all(
      Array.from({ length: 5 }, () =>
        campaignSchedulerService.claimSend(
          {
            journeyVariant: VARIANT,
            stage: STAGE,
            email: CLAIM.toUpperCase(),
            campaignId: null,
            leadId: null,
            locale: LOCALE,
          },
          logger,
        ),
      ),
    );
    expect(retry.filter((c) => c === "claimed")).toHaveLength(1);
  }, 60_000);
});

/** Insert a pending row even if the lead already has one (simulates a bug). */
async function makePendingRowForce(leadId: string | undefined): Promise<string> {
  expect(leadId).toBeDefined();
  return await makePendingRow(leadId ?? "");
}
