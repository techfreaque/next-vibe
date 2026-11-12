/**
 * Consented newsletter audience gate (getConsentedNewsletterAudience).
 *
 * Only confirmed opt-ins may receive the newsletter:
 * - account holder with marketing consent AND a verified email, or
 * - confirmed double-opt-in newsletter subscriber,
 * and never anyone who unsubscribed, bounced or is otherwise suppressed.
 *
 * Calls the real audience function the blast and the send-time dispatcher gate
 * use. Requires the dev DB. No mail is sent and no campaign rows are written.
 * Scoped to unique test emails so no real/seeded contact is touched.
 */

import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";

import { newsletterSubscriptions } from "../../../../newsletter/db";
import { NewsletterSubscriptionStatus } from "../../../../newsletter/enum";
import { campaignSchedulerService } from "./scheduler";

const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const addr = (name: string): string =>
  `blast-${RUN}-${name}@example-test.invalid`;

const E = {
  verified: addr("verified"),
  unverified: addr("unverified"),
  noConsent: addr("noconsent"),
  unsubscribedUser: addr("unsubscribed-user"),
  bouncedLeadUser: addr("bounced-lead-user"),
  confirmedSub: addr("confirmed-sub"),
  unconfirmedSub: addr("unconfirmed-sub"),
};
const ALL = Object.values(E);

async function makeUser(
  email: string,
  opts: { emailVerified: boolean; marketingConsent: boolean },
): Promise<void> {
  await db.insert(users).values({
    email,
    password: "x",
    privateName: "Test",
    publicName: "Test",
    locale: defaultLocale,
    emailVerified: opts.emailVerified,
    marketingConsent: opts.marketingConsent,
  });
}

async function makeSub(
  email: string,
  opts: {
    status:
      | typeof NewsletterSubscriptionStatus.SUBSCRIBED
      | typeof NewsletterSubscriptionStatus.UNSUBSCRIBED;
    confirmed: boolean;
  },
): Promise<void> {
  await db.insert(newsletterSubscriptions).values({
    email,
    status: opts.status,
    confirmedAt: opts.confirmed ? new Date() : null,
    marketingConsent:
      opts.status === NewsletterSubscriptionStatus.SUBSCRIBED,
  });
}

async function audienceEmails(): Promise<Set<string>> {
  const audience =
    await campaignSchedulerService.getConsentedNewsletterAudience();
  return new Set(
    audience.map((r) => r.email).filter((e) => ALL.includes(e)),
  );
}

beforeAll(async () => {
  await makeUser(E.verified, { emailVerified: true, marketingConsent: true });
  await makeUser(E.unverified, {
    emailVerified: false,
    marketingConsent: true,
  });
  await makeUser(E.noConsent, {
    emailVerified: true,
    marketingConsent: false,
  });
  // Consented + verified, but opted out via the unsubscribe page (which only
  // writes newsletter_subscriptions, never users.marketing_consent).
  await makeUser(E.unsubscribedUser, {
    emailVerified: true,
    marketingConsent: true,
  });
  await makeSub(E.unsubscribedUser, {
    status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
    confirmed: true,
  });
  // Consented + verified, but a lead row for the address bounced.
  await makeUser(E.bouncedLeadUser, {
    emailVerified: true,
    marketingConsent: true,
  });
  await db.insert(leads).values({
    email: E.bouncedLeadUser,
    businessName: "",
    language: "en",
    country: "GLOBAL",
    status: LeadStatus.BOUNCED,
    source: LeadSource.WEBSITE,
  });
  // Newsletter-only opt-ins (no account).
  await makeSub(E.confirmedSub, {
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    confirmed: true,
  });
  await makeSub(E.unconfirmedSub, {
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    confirmed: false,
  });
}, 60_000);

afterAll(async () => {
  await db
    .delete(newsletterSubscriptions)
    .where(inArray(newsletterSubscriptions.email, ALL));
  await db.delete(leads).where(inArray(leads.email, ALL));
  await db.delete(users).where(inArray(users.email, ALL));
}, 60_000);

describe("consented newsletter audience", () => {
  it("includes only confirmed opt-ins and drops every suppressed address", async () => {
    const audience = await audienceEmails();
    expect(audience.has(E.verified)).toBe(true);
    expect(audience.has(E.confirmedSub)).toBe(true);

    expect(audience.has(E.unverified)).toBe(false);
    expect(audience.has(E.noConsent)).toBe(false);
    expect(audience.has(E.unconfirmedSub)).toBe(false);
    expect(audience.has(E.unsubscribedUser)).toBe(false);
    expect(audience.has(E.bouncedLeadUser)).toBe(false);
  }, 60_000);

  it("send-time gate agrees with the audience", async () => {
    expect(
      await campaignSchedulerService.isConsentedNewsletterRecipient(
        E.verified.toUpperCase(),
      ),
    ).toBe(true);
    expect(
      await campaignSchedulerService.isConsentedNewsletterRecipient(
        E.unsubscribedUser,
      ),
    ).toBe(false);
    expect(
      await campaignSchedulerService.isConsentedNewsletterRecipient(
        E.unverified,
      ),
    ).toBe(false);
  }, 60_000);
});
