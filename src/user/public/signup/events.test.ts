/**
 * Signup funnel step events: started, email sent / failed, bounced, expired,
 * confirmed. Dated, idempotent for replayed steps, keyed by lead (no address).
 * Requires the dev DB, like the other signup tests.
 */

import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { SignupBounceReason } from "./bounce-reason";
import { recordSignupDeliveryReport } from "./bounces/repository";
import type { sendSignupChallenge } from "./confirmation-mail";
import { pendingSignups, signupEvents } from "./db";
import { setMxResolverForTests } from "./disposable-mx";
import { SignupEventType } from "./event-type";
import { recordExpiredSignups } from "./events";
import { scopedTranslation } from "./i18n";
import { SignupRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const leadIds: string[] = [];
const accountIds: string[] = [];
const password = "SignupPass103";

async function guest(): Promise<JWTPublicPayloadType> {
  const leadId = await createAnonymousLead(
    { userAgent: randomUUID() },
    defaultLocale,
    logger,
  );
  leadIds.push(leadId);
  return { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
}

async function start(delivered = true): Promise<{
  user: JWTPublicPayloadType;
  email: string;
  pendingId: string;
  inbox: { code: string; token: string }[];
}> {
  const user = await guest();
  const email = `signup-events-${randomUUID()}@fixture.invalid`;
  const inbox: { code: string; token: string }[] = [];
  const deliver: typeof sendSignupChallenge = async (_row, challenge) => {
    inbox.push(challenge);
    return delivered ? `<${randomUUID()}@fixture.invalid>` : null;
  };
  const started = await SignupRepository.registerUser(
    {
      email,
      password,
      confirmPassword: password,
      privateName: "Signup events",
      publicName: "Signup events",
      acceptTerms: true,
      subscribeToNewsletter: false,
    },
    user,
    defaultLocale,
    logger,
    Platform.NEXT_API,
    t,
    undefined,
    deliver,
  );
  if (!started.success) {
    return expect.fail(started.message);
  }
  return { user, email, pendingId: started.data.pendingId, inbox };
}

async function eventsFor(leadId: string): Promise<string[]> {
  const rows = await db
    .select({ type: signupEvents.type })
    .from(signupEvents)
    .where(eq(signupEvents.leadId, leadId))
    .orderBy(signupEvents.occurredAt);
  return rows.map((row) => row.type);
}

beforeAll(() => setMxResolverForTests(async () => ["mail.fixture.invalid"]));
afterAll(async () => {
  setMxResolverForTests(null);
  for (const id of accountIds) {
    await deleteTestUser(id);
  }
  if (leadIds.length) {
    await db.delete(leads).where(inArray(leads.id, leadIds));
  }
});

describe("signup step events", () => {
  it("records started + sent, then confirmed exactly once", async () => {
    const { user, email, pendingId, inbox } = await start();
    expect(await eventsFor(user.leadId)).toEqual([
      SignupEventType.STARTED,
      SignupEventType.EMAIL_SENT,
    ]);
    const confirmed = await SignupRepository.confirmation(
      { pendingId, code: inbox[0]?.code },
      user,
      defaultLocale,
      logger,
      Platform.NEXT_API,
      t,
      undefined,
    );
    expect(confirmed.success).toBe(true);
    const [account] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    if (account) {
      accountIds.push(account.id);
    }
    const steps = await eventsFor(user.leadId);
    expect(steps.filter((s) => s === SignupEventType.CONFIRMED)).toHaveLength(
      1,
    );
    const [row] = await db
      .select()
      .from(signupEvents)
      .where(eq(signupEvents.pendingId, pendingId))
      .limit(1);
    // No address or IP on the event row.
    expect(Object.keys(row ?? {}).toSorted()).toEqual([
      "dedupeKey",
      "id",
      "leadId",
      "occurredAt",
      "pendingId",
      "type",
    ]);
  }, 60000);

  it("records a failed send instead of a sent mail", async () => {
    const { user } = await start(false);
    expect(await eventsFor(user.leadId)).toEqual([
      SignupEventType.STARTED,
      SignupEventType.SEND_FAILED,
    ]);
  });

  it("records one bounce per dispatch and one expiry per window", async () => {
    const { user, email, pendingId } = await start();
    const [pending] = await db
      .select()
      .from(pendingSignups)
      .where(eq(pendingSignups.id, pendingId));
    const report = (): Promise<number> =>
      recordSignupDeliveryReport(
        {
          failures: [{ recipient: email, reason: SignupBounceReason.OTHER }],
          messageId: pending?.messageId ?? undefined,
          sentAt: undefined,
          sender: "hi@unbottled.ai",
          subject: t("confirmation.link"),
        },
        new Date(),
        "hi@unbottled.ai",
      );
    expect(await report()).toBe(1);
    // A refined reason updates the row again but never re-counts the bounce.
    await recordSignupDeliveryReport(
      {
        failures: [{ recipient: email, reason: SignupBounceReason.POLICY }],
        messageId: pending?.messageId ?? undefined,
        sentAt: undefined,
        sender: "hi@unbottled.ai",
        subject: t("confirmation.link"),
      },
      new Date(),
      "hi@unbottled.ai",
    );

    await db
      .update(pendingSignups)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(pendingSignups.id, pendingId));
    await recordExpiredSignups(logger);
    await recordExpiredSignups(logger);

    const steps = await eventsFor(user.leadId);
    expect(steps.filter((s) => s === SignupEventType.BOUNCED)).toHaveLength(1);
    expect(steps.filter((s) => s === SignupEventType.EXPIRED)).toHaveLength(1);
  });
});
