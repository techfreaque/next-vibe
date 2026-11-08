/**
 * Lifecycle engine - enrollment, idempotency, frequency cap, exit-on-goal,
 * unsubscribe, backfill dry-run. Requires the dev DB. The transport is a
 * recording mock: NO mail is ever sent. All work is scoped to test emails
 * (`onlyEmails`) so no real/seeded contact is touched.
 */

import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { chatThreads } from "next-vibe/agent/chat/db";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";

import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { lifecycleEnrollments, lifecycleSends } from "./db";
import {
  advanceDue,
  exitAllForEmail,
  planContacts,
  runBackfill,
  runLifecycle,
  type SettingsValues,
} from "./engine";
import {
  LifecycleEnrollmentStatus,
  LifecycleExitReason,
  LifecycleJourney,
} from "./enum";
import type { LifecycleMail, LifecycleTransport } from "./transport";

const logger = createEndpointLogger(false, defaultLocale);
const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const addr = (name: string): string => `lc-${RUN}-${name}@example-test.invalid`;

const E = {
  inactive: addr("inactive"),
  engaged: addr("engaged"),
  noConsent: addr("noconsent"),
  paid: addr("paid"),
  unsubUser: addr("unsubuser"),
  nlConfirmed: addr("nl-confirmed"),
  nlPending: addr("nl-pending"),
  nlUnsub: addr("nl-unsub"),
  capped: addr("capped"),
};
const ALL = Object.values(E);

const live: SettingsValues = {
  paused: false,
  minHoursBetweenEmails: 48,
  maxSendsPerRun: 100,
  requireUserMarketingConsent: true,
  autoEnrollWindowDays: 14,
};
const paused: SettingsValues = { ...live, paused: true };

const HOUR = 3_600_000;
const NOW = new Date();
const LATER = new Date(NOW.getTime() + 100 * HOUR);

const userIds: string[] = [];
const leadIds: string[] = [];

function recordingTransport(failFor?: string): {
  transport: LifecycleTransport;
  sent: LifecycleMail[];
} {
  const sent: LifecycleMail[] = [];
  return {
    sent,
    transport: {
      send: async (mail) => {
        if (failFor && mail.to === failFor) {
          return fail({
            message: "mock transport failure",
            errorType: ErrorResponseTypes.EMAIL_ERROR,
          });
        }
        sent.push(mail);
        return success({ messageId: `mock-${sent.length}` });
      },
    },
  };
}

async function makeUser(
  email: string,
  opts: { marketingConsent?: boolean } = {},
): Promise<string> {
  const [u] = await db
    .insert(users)
    .values({
      email,
      password: "x",
      privateName: "Test",
      publicName: "Test",
      locale: defaultLocale,
      emailVerified: true,
      marketingConsent: opts.marketingConsent ?? true,
    })
    .returning({ id: users.id });
  userIds.push(u.id);
  return u.id;
}

async function makeChat(userId: string): Promise<void> {
  await db.insert(chatThreads).values({
    userId,
    title: "t",
    rootFolderId: "private",
  });
}

async function makeNewsletter(
  email: string,
  status: (typeof NewsletterSubscriptionStatus)[keyof typeof NewsletterSubscriptionStatus],
  confirmed: boolean,
): Promise<void> {
  await db.insert(newsletterSubscriptions).values({
    email,
    status,
    confirmedAt: confirmed ? new Date() : null,
    marketingConsent: true,
  });
}

async function enrollmentFor(email: string): Promise<typeof lifecycleEnrollments.$inferSelect | undefined> {
  const [row] = await db
    .select()
    .from(lifecycleEnrollments)
    .where(eq(lifecycleEnrollments.email, email));
  return row;
}

beforeAll(async () => {
  await makeUser(E.inactive);
  const engaged = await makeUser(E.engaged);
  await makeChat(engaged);
  await makeUser(E.noConsent, { marketingConsent: false });
  const paid = await makeUser(E.paid);
  await makeChat(paid);
  await db.insert(paymentTransactions).values({
    userId: paid,
    amount: "5.00",
    currency: "EUR",
    status: PaymentStatus.SUCCEEDED,
  });
  await makeUser(E.unsubUser);
  await makeNewsletter(E.unsubUser, NewsletterSubscriptionStatus.UNSUBSCRIBED, true);
  await makeNewsletter(E.nlConfirmed, NewsletterSubscriptionStatus.SUBSCRIBED, true);
  await makeNewsletter(E.nlPending, NewsletterSubscriptionStatus.PENDING, false);
  await makeNewsletter(E.nlUnsub, NewsletterSubscriptionStatus.UNSUBSCRIBED, true);
  const cappedUser = await makeUser(E.capped);
  const [lead] = await db
    .insert(leads)
    .values({
      email: E.capped,
      businessName: "",
      status: LeadStatus.WEBSITE_USER,
      source: LeadSource.WEBSITE,
      country: "DE",
      language: "de",
      convertedUserId: cappedUser,
      lastEmailSentAt: new Date(LATER.getTime() - HOUR),
    })
    .returning({ id: leads.id });
  leadIds.push(lead.id);
});

afterAll(async () => {
  await db.delete(lifecycleEnrollments).where(inArray(lifecycleEnrollments.email, ALL));
  await db.delete(newsletterSubscriptions).where(inArray(newsletterSubscriptions.email, ALL));
  if (leadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, leadIds));
  }
  if (userIds.length > 0) {
    await db.delete(paymentTransactions).where(inArray(paymentTransactions.userId, userIds));
    await db.delete(chatThreads).where(inArray(chatThreads.userId, userIds));
    await db.delete(users).where(inArray(users.id, userIds));
  }
});

describe("lifecycle engine", () => {
  it("backfill dry-run reports segment counts and enrolls nothing", async () => {
    const result = await runBackfill({
      dryRun: true,
      spreadHours: 72,
      now: NOW,
      settings: live,
      onlyEmails: ALL,
    });
    const count = (j: string): number =>
      result.perJourney.find((p) => p.journey === j)?.eligible ?? -1;
    // inactive + capped (capped is eligible; the cap only delays the send)
    expect(count(LifecycleJourney.INACTIVE_USER)).toBe(2);
    expect(count(LifecycleJourney.ENGAGED_FREE)).toBe(1);
    expect(count(LifecycleJourney.NEWSLETTER_INVITE)).toBe(1);
    expect(result.held.noConsent).toBe(1);
    expect(result.held.paid).toBe(1);
    expect(result.held.suppressed).toBe(2); // unsubscribed user + unsubscribed newsletter
    expect(result.held.pendingNewsletter).toBe(1);
    expect(await enrollmentFor(E.inactive)).toBeUndefined();
  });

  it("backfill enrolls eligible contacts only, spread over the window, and is idempotent", async () => {
    const first = await runBackfill({
      dryRun: false,
      spreadHours: 72,
      now: NOW,
      settings: live,
      onlyEmails: ALL,
    });
    expect(first.perJourney.reduce((n, p) => n + p.enrolled, 0)).toBe(4);

    for (const excluded of [E.noConsent, E.paid, E.unsubUser, E.nlPending, E.nlUnsub]) {
      expect(await enrollmentFor(excluded), excluded).toBeUndefined();
    }
    const rows = await db
      .select()
      .from(lifecycleEnrollments)
      .where(inArray(lifecycleEnrollments.email, ALL));
    expect(rows).toHaveLength(4);
    expect(rows.every((r) => r.fromBackfill)).toBe(true);
    const dues = rows.map((r) => r.nextDueAt.getTime());
    expect(Math.max(...dues)).toBeLessThan(NOW.getTime() + 72 * HOUR);
    expect(new Set(dues).size).toBe(4);

    const second = await runBackfill({
      dryRun: false,
      spreadHours: 72,
      now: NOW,
      settings: live,
      onlyEmails: ALL,
    });
    expect(second.perJourney.reduce((n, p) => n + p.enrolled, 0)).toBe(0);
    const again = await db
      .select()
      .from(lifecycleEnrollments)
      .where(inArray(lifecycleEnrollments.email, ALL));
    expect(again).toHaveLength(4);

    // auto mode also never double-enrolls
    const plan = await planContacts({
      mode: "auto",
      now: NOW,
      settings: live,
      onlyEmails: ALL,
    });
    expect(plan.toEnroll).toHaveLength(0);
  });

  it("kill switch: paused sends nothing and enrolls nothing", async () => {
    const { transport, sent } = recordingTransport();
    const advanced = await advanceDue({
      now: LATER,
      settings: paused,
      transport,
      logger,
      onlyEmails: ALL,
    });
    const run = await runLifecycle({
      dryRun: false,
      logger,
      transport,
      now: LATER,
      settings: paused,
      onlyEmails: ALL,
    });
    expect(advanced).toEqual({ sent: 0, exited: 0, deferred: 0, failed: 0 });
    expect(run.paused).toBe(true);
    expect(run.sent).toBe(0);
    expect(sent).toHaveLength(0);
  });

  it("sends step 0 once, honors the frequency cap, never sends a step twice", async () => {
    const { transport, sent } = recordingTransport();
    const first = await advanceDue({
      now: LATER,
      settings: live,
      transport,
      logger,
      onlyEmails: ALL,
    });
    // capped contact (lead.lastEmailSentAt = 1h before send time) is deferred, the other 3 go out
    expect(first.sent).toBe(3);
    expect(first.deferred).toBe(1);
    expect(sent.map((m) => m.to).toSorted()).toEqual(
      [E.inactive, E.engaged, E.nlConfirmed].toSorted(),
    );
    expect(sent.find((m) => m.to === E.nlConfirmed)?.newsletterOnly).toBe(true);
    expect(sent.every((m) => m.html.includes("unsubscribe"))).toBe(true);

    const row = await enrollmentFor(E.inactive);
    expect(row?.nextStep).toBe(1);

    // Same instant again: nothing due / nothing re-sent.
    const second = await advanceDue({
      now: LATER,
      settings: live,
      transport,
      logger,
      onlyEmails: ALL,
    });
    expect(second.sent).toBe(0);
    expect(sent).toHaveLength(3);

    const sendRows = await db
      .select()
      .from(lifecycleSends)
      .where(inArray(lifecycleSends.email, ALL));
    expect(sendRows).toHaveLength(3);
  });

  it("a pre-existing send claim blocks a duplicate send of that step", async () => {
    const capped = await enrollmentFor(E.capped);
    expect(capped?.nextStep).toBe(0);
    await db.insert(lifecycleSends).values({
      enrollmentId: capped?.id ?? "",
      email: E.capped,
      step: 0,
    });
    const { transport, sent } = recordingTransport();
    // far enough that the cap has released
    const far = new Date(NOW.getTime() + 300 * HOUR);
    const r = await advanceDue({
      now: far,
      settings: live,
      transport,
      logger,
      onlyEmails: [E.capped],
    });
    expect(r.sent).toBe(0);
    expect(sent.filter((m) => m.to === E.capped)).toHaveLength(0);
  });

  it("exits quietly when the goal is met (first chat)", async () => {
    const inactive = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, E.inactive));
    await makeChat(inactive[0].id);
    const { transport, sent } = recordingTransport();
    const far = new Date(NOW.getTime() + 300 * HOUR);
    const r = await advanceDue({
      now: far,
      settings: live,
      transport,
      logger,
      onlyEmails: [E.inactive],
    });
    expect(r.exited).toBe(1);
    expect(sent).toHaveLength(0);
    const row = await enrollmentFor(E.inactive);
    expect(row?.status).toBe(LifecycleEnrollmentStatus.EXITED);
    expect(row?.exitReason).toBe(LifecycleExitReason.GOAL_MET);
    expect(row?.convertedAt).not.toBeNull();
  });

  it("unsubscribe exits all active journeys immediately", async () => {
    const exited = await exitAllForEmail(E.engaged, LifecycleExitReason.UNSUBSCRIBED);
    expect(exited).toBe(1);
    const row = await enrollmentFor(E.engaged);
    expect(row?.status).toBe(LifecycleEnrollmentStatus.EXITED);
    expect(row?.exitReason).toBe(LifecycleExitReason.UNSUBSCRIBED);
    const { transport, sent } = recordingTransport();
    const far = new Date(NOW.getTime() + 300 * HOUR);
    await advanceDue({ now: far, settings: live, transport, logger, onlyEmails: [E.engaged] });
    expect(sent).toHaveLength(0);
  });

  it("suppression is re-checked at send time (late unsubscribe)", async () => {
    await db
      .update(newsletterSubscriptions)
      .set({ status: NewsletterSubscriptionStatus.UNSUBSCRIBED })
      .where(eq(newsletterSubscriptions.email, E.nlConfirmed));
    const { transport, sent } = recordingTransport();
    const far = new Date(NOW.getTime() + 300 * HOUR);
    const r = await advanceDue({
      now: far,
      settings: live,
      transport,
      logger,
      onlyEmails: [E.nlConfirmed],
    });
    expect(r.exited).toBe(1);
    expect(sent).toHaveLength(0);
    expect((await enrollmentFor(E.nlConfirmed))?.exitReason).toBe(
      LifecycleExitReason.UNSUBSCRIBED,
    );
  });

  it("transport failure releases the claim and retries; no step is lost", async () => {
    const email = E.capped;
    await db
      .update(leads)
      .set({ lastEmailSentAt: null })
      .where(inArray(leads.id, leadIds));
    await db.delete(lifecycleSends).where(eq(lifecycleSends.email, email));
    const failing = recordingTransport(email);
    const far = new Date(NOW.getTime() + 300 * HOUR);
    const r = await advanceDue({
      now: far,
      settings: live,
      transport: failing.transport,
      logger,
      onlyEmails: [email],
    });
    expect(r.failed).toBe(1);
    const row = await enrollmentFor(email);
    expect(row?.failCount).toBe(1);
    expect(row?.status).toBe(LifecycleEnrollmentStatus.ACTIVE);
    expect(row?.nextStep).toBe(0);
    const claims = await db
      .select()
      .from(lifecycleSends)
      .where(eq(lifecycleSends.email, email));
    expect(claims).toHaveLength(0);

    const ok = recordingTransport();
    const later = new Date(far.getTime() + 2 * HOUR);
    const retry = await advanceDue({
      now: later,
      settings: live,
      transport: ok.transport,
      logger,
      onlyEmails: [email],
    });
    expect(retry.sent).toBe(1);
    expect((await enrollmentFor(email))?.nextStep).toBe(1);
  });
});
