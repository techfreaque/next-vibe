/**
 * Newsletter double opt-in -> free-credit bonus, end to end through the endpoints:
 * subscribe (guest email capture) -> PENDING_CONFIRMATION, token only in the DB,
 * confirm -> bonus live on the guest's pool, second pool claiming the same email
 * gets nothing. Requires the dev DB.
 */

import { eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { newsletterSubscriptions } from "../db";
import { NewsletterCreditBonus } from "../enum";
import subscribeEndpoints from "../subscribe/definition";
import confirmEndpoints from "./definition";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const createdLeadIds: string[] = [];
const createdEmails: string[] = [];

async function createGuest(): Promise<JwtPayloadType> {
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
  return {
    isPublic: true,
    leadId: lead.id,
    roles: [UserPermissionRole.PUBLIC],
  };
}

async function freeBalance(user: JwtPayloadType): Promise<number> {
  const res = await CreditRepository.getBalance(
    user,
    logger,
    creditsT,
    defaultLocale,
  );
  return res.success ? res.data.free : -1;
}

afterAll(async () => {
  if (createdEmails.length > 0) {
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, createdEmails));
  }
  if (createdLeadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("newsletter double opt-in unlocks the free-credit bonus", () => {
  it("guest email capture -> confirm -> +bonus; same email elsewhere gets nothing", async () => {
    const email = `nl-confirm-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example-test.invalid`;
    createdEmails.push(email);
    const guest = await createGuest();
    expect(await freeBalance(guest)).toBe(FREE_CREDIT_ALLOWANCE.guest);

    const subscribed = await sendTestRequest({
      endpoint: subscribeEndpoints.POST,
      data: { email },
      user: guest,
      toolExecutionContext: undefined,
    });
    expect(subscribed.success, JSON.stringify(subscribed)).toBe(true);
    if (!subscribed.success) {
      return;
    }
    expect(subscribed.data.creditBonus).toBe(
      NewsletterCreditBonus.PENDING_CONFIRMATION,
    );
    expect(subscribed.data.bonusCredits).toBe(
      FREE_CREDIT_ALLOWANCE.newsletterBonus,
    );
    expect(JSON.stringify(subscribed.data)).not.toContain("confirmationToken");

    // Lead captured the address (journey can reach it); bonus not live yet
    const [lead] = await db
      .select({ email: leads.email })
      .from(leads)
      .where(eq(leads.id, guest.leadId));
    expect(lead?.email).toBe(email);
    expect(await freeBalance(guest)).toBe(FREE_CREDIT_ALLOWANCE.guest);

    const bogus = await sendTestRequest({
      endpoint: confirmEndpoints.POST,
      data: { token: "not-a-real-token-0000000000" },
      user: guest,
      toolExecutionContext: undefined,
    });
    expect(bogus.success).toBe(false);
    if (!bogus.success) {
      expect(bogus.errorType.errorCode).toBe(
        ErrorResponseTypes.NOT_FOUND.errorCode,
      );
    }

    const [row] = await db
      .select({ token: newsletterSubscriptions.confirmationToken })
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    expect(row?.token).toBeTruthy();
    if (!row?.token) {
      return;
    }

    const confirmed = await sendTestRequest({
      endpoint: confirmEndpoints.POST,
      data: { token: row.token },
      user: guest,
      toolExecutionContext: undefined,
    });
    expect(confirmed.success, JSON.stringify(confirmed)).toBe(true);
    expect(await freeBalance(guest)).toBe(
      FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.newsletterBonus,
    );

    // Same address from the same visitor: bonus reported live
    const again = await sendTestRequest({
      endpoint: subscribeEndpoints.POST,
      data: { email },
      user: guest,
      toolExecutionContext: undefined,
    });
    expect(again.success && again.data.creditBonus).toBe(
      NewsletterCreditBonus.ACTIVE,
    );

    // Farming attempt: another browser enters the same address
    const other = await createGuest();
    const farmed = await sendTestRequest({
      endpoint: subscribeEndpoints.POST,
      data: { email },
      user: other,
      toolExecutionContext: undefined,
    });
    expect(farmed.success && farmed.data.creditBonus).toBe(
      NewsletterCreditBonus.CLAIMED_ELSEWHERE,
    );
    expect(await freeBalance(other)).toBe(FREE_CREDIT_ALLOWANCE.guest);
  });
});
