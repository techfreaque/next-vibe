/**
 * Migration 20261114120000_signup_newsletter_legacy: accounts that kept the
 * old pre-ticked signup box (users.marketing_consent) but never got a
 * newsletter subscription become confirmed subscribers, once.
 *
 * Runs the real migration SQL against the dev DB, scoped to this file's test
 * addresses so no real or seeded account is touched.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { eq, inArray, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { EmailJourneyVariant, LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { poolHasConfirmedNewsletter } from "@/credits/free-allowance";
import { campaignSchedulerService } from "@/leads/campaigns/emails/services/scheduler";

import { newsletterSubscriptions } from "./db";
import { NewsletterSubscriptionStatus } from "./enum";

const logger = createEndpointLogger(false, defaultLocale);
const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const addr = (name: string): string =>
  `nl-legacy-${RUN}-${name}@example-test.invalid`;

const E = {
  ticked: addr("ticked"),
  tickedSubscribed: addr("ticked-subscribed"),
  tickedOptedOut: addr("ticked-opted-out"),
  notTicked: addr("not-ticked"),
};
const ALL = Object.values(E);
const SIGNUP_AT = new Date(Date.UTC(2026, 5, 2, 10, 30, 0));

const MIGRATION_FILTER = `WHERE u."marketing_consent" = true`;

/** The migration's SQL, limited to this file's addresses */
function scopedMigrationSql(): string {
  const raw = readFileSync(
    join(process.cwd(), "drizzle", "20261114120000_signup_newsletter_legacy.sql"),
    "utf8",
  );
  expect(raw).toContain(MIGRATION_FILTER);
  const scope = ALL.map((e) => `'${e}'`).join(", ");
  return raw.replace(
    MIGRATION_FILTER,
    `${MIGRATION_FILTER} AND u."email" IN (${scope})`,
  );
}

const userIds: Record<string, string> = {};
const leadIds: Record<string, string> = {};

async function makeAccount(email: string, marketingConsent: boolean): Promise<void> {
  const [user] = await db
    .insert(users)
    .values({
      email,
      password: "x",
      privateName: "Legacy Tester",
      publicName: "Legacy Tester",
      locale: defaultLocale,
      emailVerified: false,
      marketingConsent,
      createdAt: SIGNUP_AT,
    })
    .returning({ id: users.id });
  const [lead] = await db
    .insert(leads)
    .values({
      email,
      businessName: "",
      language: "en",
      country: "GLOBAL",
      status: LeadStatus.SIGNED_UP,
      source: LeadSource.WEBSITE,
    })
    .returning({ id: leads.id });
  await db
    .insert(userLeadLinks)
    .values({ userId: user.id, leadId: lead.id, linkReason: "signup" });
  userIds[email] = user.id;
  leadIds[email] = lead.id;
}

beforeAll(async () => {
  await makeAccount(E.ticked, true);
  await makeAccount(E.tickedSubscribed, true);
  await makeAccount(E.tickedOptedOut, true);
  await makeAccount(E.notTicked, false);
  // Subscribed through the current signup path already
  await db.insert(newsletterSubscriptions).values({
    email: E.tickedSubscribed,
    userId: userIds[E.tickedSubscribed],
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    source: "website",
  });
  // Unsubscribed since: must stay out
  await db.insert(newsletterSubscriptions).values({
    email: E.tickedOptedOut.toUpperCase(),
    status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
    marketingConsent: false,
  });
}, 60_000);

afterAll(async () => {
  const upper = ALL.map((e) => e.toUpperCase());
  await db
    .delete(newsletterSubscriptions)
    .where(inArray(newsletterSubscriptions.email, [...ALL, ...upper]));
  await db.delete(leads).where(inArray(leads.email, ALL));
  await db.delete(users).where(inArray(users.email, ALL));
}, 60_000);

async function rowsFor(email: string): Promise<
  Array<typeof newsletterSubscriptions.$inferSelect>
> {
  return db
    .select()
    .from(newsletterSubscriptions)
    .where(
      sql`lower(${newsletterSubscriptions.email}) = ${email.toLowerCase()}`,
    );
}

describe("signup newsletter legacy migration", () => {
  it("subscribes ticked accounts without a subscription, confirmed at signup", async () => {
    await db.execute(sql.raw(scopedMigrationSql()));

    const [row] = await rowsFor(E.ticked);
    expect(row).toBeDefined();
    expect(row?.status).toBe(NewsletterSubscriptionStatus.SUBSCRIBED);
    expect(row?.source).toBe("signup-checkbox-legacy");
    expect(row?.userId).toBe(userIds[E.ticked]);
    expect(row?.leadId).toBe(leadIds[E.ticked]);
    expect(row?.marketingConsent).toBe(true);
    expect(row?.confirmedAt?.getTime()).toBe(SIGNUP_AT.getTime());

    // Existing rows untouched, opt-outs stay out, unticked never added
    const [existing] = await rowsFor(E.tickedSubscribed);
    expect(existing?.source).toBe("website");
    expect(existing?.confirmedAt).toBeNull();
    const optedOut = await rowsFor(E.tickedOptedOut);
    expect(optedOut).toHaveLength(1);
    expect(optedOut[0]?.status).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
    expect(await rowsFor(E.notTicked)).toHaveLength(0);
  }, 60_000);

  it("is idempotent", async () => {
    await db.execute(sql.raw(scopedMigrationSql()));
    expect(await rowsFor(E.ticked)).toHaveLength(1);
    expect(await rowsFor(E.notTicked)).toHaveLength(0);
  }, 60_000);

  it("puts them in the newsletter audience and the once-per-address blast", async () => {
    expect(
      await campaignSchedulerService.isConsentedNewsletterRecipient(E.ticked),
    ).toBe(true);
    expect(
      await campaignSchedulerService.isConsentedNewsletterRecipient(
        E.tickedOptedOut,
      ),
    ).toBe(false);

    const dry =
      await campaignSchedulerService.bootstrapConsentedNewsletterBlast(
        EmailJourneyVariant.NEWSLETTER_NOV_2026,
        logger,
        { dryRun: true, onlyEmails: ALL },
      );
    expect(dry.audience).toBe(1);
    expect(dry.scheduled).toBe(1);
  }, 60_000);

  it("counts as a confirmed subscription for the newsletter bonus", async () => {
    expect(
      await poolHasConfirmedNewsletter({
        userId: userIds[E.ticked] ?? null,
        leadIds: [leadIds[E.ticked] ?? ""],
      }),
    ).toBe(true);
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, E.notTicked));
    expect(
      await poolHasConfirmedNewsletter({
        userId: user?.id ?? null,
        leadIds: [leadIds[E.notTicked] ?? ""],
      }),
    ).toBe(false);
  }, 60_000);
});
