/**
 * Signup anti-farming email guard (requires the dev DB; mails go to .invalid):
 * - an alias of an existing email (gmail dots, +tags) is rejected like a duplicate
 * - disposable domains (and their subdomains) are rejected
 * - a normal distinct email still signs up
 */

import { and, gte, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, describe, expect, it } from "vitest";

import { antiFarmingEvents } from "@/credits/anti-farming/db";

import signupEndpoints from "./definition";
import { findUserByNormalizedEmail } from "./email-guard";
import { scopedTranslation } from "./i18n";

const { t } = scopedTranslation.scopedT(defaultLocale);
const createdUserIds: string[] = [];
const createdLeadIds: string[] = [];
const startedAt = new Date();
const EVENT_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "example-test.invalid",
  "mailinator.com",
  "inbox.yopmail.com",
];

/** Events this file recorded (scoped to its run window + domains) */
async function recordedEvents(): Promise<
  Array<{ kind: string; domain: string | null }>
> {
  const rows = await db
    .select({
      kind: antiFarmingEvents.kind,
      domain: antiFarmingEvents.emailDomain,
    })
    .from(antiFarmingEvents)
    .where(
      and(
        gte(antiFarmingEvents.createdAt, startedAt),
        inArray(antiFarmingEvents.emailDomain, EVENT_DOMAINS),
      ),
    );
  return rows;
}

function tag(): string {
  return `${String(Date.now())}${String(Math.floor(Math.random() * 1e6))}`;
}

async function createGuestLead(): Promise<string> {
  const { language, country } = getLanguageAndCountryFromLocale(defaultLocale);
  const [lead] = await db
    .insert(leads)
    .values({
      businessName: "",
      status: LeadStatus.WEBSITE_USER,
      source: LeadSource.WEBSITE,
      country,
      language,
    })
    .returning({ id: leads.id });
  createdLeadIds.push(lead.id);
  return lead.id;
}

async function signup(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const leadId = await createGuestLead();
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: signupEndpoints.POST,
    data: {
      privateName: "Email Guard",
      publicName: "EmailGuard",
      email,
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      acceptTerms: true,
      subscribeToNewsletter: false,
    },
    user: { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
  });
  if (res.success) {
    const created = await findUserByNormalizedEmail(email, null);
    if (created) {
      createdUserIds.push(created.id);
    }
    return { success: true, message: "" };
  }
  return { success: false, message: res.message };
}

async function seedUser(email: string): Promise<void> {
  const res = await createTestUser(email, "EmailGuardSeed");
  expect(res.success, JSON.stringify(res)).toBe(true);
  if (res.success) {
    createdUserIds.push(res.data.user.id);
  }
}

afterAll(async () => {
  await db
    .delete(antiFarmingEvents)
    .where(
      and(
        gte(antiFarmingEvents.createdAt, startedAt),
        inArray(antiFarmingEvents.emailDomain, EVENT_DOMAINS),
      ),
    );
  for (const id of createdUserIds) {
    await deleteTestUser(id);
  }
  if (createdLeadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("signup email guard", () => {
  it("rejects a gmail dot/+tag alias of an existing account", async () => {
    const id = tag();
    await seedUser(`abc${id}@gmail.com`);
    const res = await signup(`a.b.c${id}+x@gmail.com`);
    expect(res.success).toBe(false);
    expect(res.message).toBe(t("errors.conflict.detail"));
    // googlemail.com is the same inbox
    const res2 = await signup(`abc${id}@googlemail.com`);
    expect(res2.success).toBe(false);
  }, 60_000);

  it("rejects a +tag alias on any provider", async () => {
    const id = tag();
    await seedUser(`user${id}@example-test.invalid`);
    const res = await signup(`User${id}+promo@example-test.invalid`);
    expect(res.success).toBe(false);
    expect(res.message).toBe(t("errors.conflict.detail"));
  }, 60_000);

  it("rejects disposable domains and their subdomains", async () => {
    const res = await signup(`farm${tag()}@mailinator.com`);
    expect(res.success).toBe(false);
    expect(res.message).toBe(t("errors.disposableEmail.detail"));
    const sub = await signup(`farm${tag()}@inbox.yopmail.com`);
    expect(sub.success).toBe(false);
    expect(sub.message).toBe(t("errors.disposableEmail.detail"));
  }, 60_000);

  it("still signs up a normal distinct email", async () => {
    const id = tag();
    await seedUser(`first${id}@example-test.invalid`);
    const res = await signup(`second${id}@example-test.invalid`);
    expect(res.success, res.message).toBe(true);
  }, 60_000);

  it("records an anti-farming event per alias / disposable rejection", async () => {
    const events = await recordedEvents();
    const count = (kind: string, domain: string): number =>
      events.filter((e) => e.kind === kind && e.domain === domain).length;
    expect(count("duplicate_email", "gmail.com")).toBe(1);
    expect(count("duplicate_email", "googlemail.com")).toBe(1);
    expect(count("duplicate_email", "example-test.invalid")).toBe(1);
    expect(count("disposable_email", "mailinator.com")).toBe(1);
    expect(count("disposable_email", "inbox.yopmail.com")).toBe(1);
  }, 60_000);
});
