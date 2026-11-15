/**
 * Referral code reassign — integration tests against the real DB.
 * A code owned by a placeholder account moves to the creator: dry run changes
 * nothing, the real run moves the code, its referred users and its links,
 * past earnings stay put, and the next payment pays the new owner.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { userNotes } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { growthCampaignLinks } from "@/leads/growth/db";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { referralCodes, referralEarnings, userReferrals } from "../../db";
import { ReferralRepository } from "../../repository";
import definitions from "./definition";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const CODE = `REASSIGN${stamp}`;

let placeholder: TestUser;
let creator: TestUser;
let buyer: TestUser;
let codeId: string;
let linkId: string;

async function pay(tag: string): Promise<string> {
  const [tx] = await db
    .insert(paymentTransactions)
    .values({
      userId: buyer.user.id,
      providerSessionId: `cs_test_reassign_${tag}_${stamp}`,
      providerPaymentIntentId: `pi_test_reassign_${tag}_${stamp}`,
      amount: "20.00",
      currency: "USD",
      status: PaymentStatus.SUCCEEDED,
    })
    .returning({ id: paymentTransactions.id });
  const applied = await ReferralRepository.applyReferralPayoutOnPayment(
    tx.id,
    buyer.user.id,
    2000,
    logger,
    defaultLocale,
  );
  expect(applied.success).toBe(true);
  return tx.id;
}

async function earnerOf(transactionId: string): Promise<string | undefined> {
  const [row] = await db
    .select({ earner: referralEarnings.earnerUserId })
    .from(referralEarnings)
    .where(
      and(
        eq(referralEarnings.transactionId, transactionId),
        eq(referralEarnings.level, 0),
      ),
    );
  return row?.earner;
}

async function ownerOf(): Promise<string | undefined> {
  const [row] = await db
    .select({ owner: referralCodes.ownerUserId })
    .from(referralCodes)
    .where(eq(referralCodes.id, codeId));
  return row?.owner;
}

describe("referral-code-reassign", () => {
  beforeAll(async () => {
    const p = await createTestUser(`reassign-placeholder-${stamp}@example.com`);
    const c = await createTestUser(`reassign-creator-${stamp}@example.com`);
    const b = await createTestUser(`reassign-buyer-${stamp}@example.com`);
    expect(p.success && c.success && b.success).toBe(true);
    if (!p.success || !c.success || !b.success) {
      return;
    }
    placeholder = p.data;
    creator = c.data;
    buyer = b.data;

    const [code] = await db
      .insert(referralCodes)
      .values({ code: CODE, ownerUserId: placeholder.user.id })
      .returning({ id: referralCodes.id });
    codeId = code.id;
    await db.insert(userReferrals).values({
      referrerUserId: placeholder.user.id,
      referredUserId: buyer.user.id,
      referralCodeId: codeId,
    });
    const [link] = await db
      .insert(growthCampaignLinks)
      .values({
        name: "Reassign test",
        source: "blog",
        medium: "referral",
        campaign: "reassign-test",
        refCode: CODE,
        createdByUserId: placeholder.user.id,
      })
      .returning({ id: growthCampaignLinks.id });
    linkId = link.id;
  });

  afterAll(async () => {
    await db
      .delete(growthCampaignLinks)
      .where(eq(growthCampaignLinks.id, linkId));
    await deleteTestUser(buyer.user.id);
    await deleteTestUser(creator.user.id);
    await deleteTestUser(placeholder.user.id);
  });

  it("dry run reports the move and changes nothing", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, targetUser: creator.email, dryRun: true },
      toolExecutionContext: undefined,
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.dryRunApplied).toBe(true);
    expect(res.data.fromUserId).toBe(placeholder.user.id);
    expect(res.data.toUserId).toBe(creator.user.id);
    expect(res.data.referralsMoved).toBe(1);
    expect(res.data.linksMoved).toBe(1);
    expect(await ownerOf()).toBe(placeholder.user.id);
    const [ref] = await db
      .select({ referrer: userReferrals.referrerUserId })
      .from(userReferrals)
      .where(eq(userReferrals.referredUserId, buyer.user.id));
    expect(ref?.referrer).toBe(placeholder.user.id);
  });

  it("dry run is the default", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, targetUser: creator.user.id },
      toolExecutionContext: undefined,
    });
    expect(res.success && res.data.dryRunApplied).toBe(true);
    expect(await ownerOf()).toBe(placeholder.user.id);
  });

  it("reassign moves ownership; past earnings stay, future earnings go to the new owner", async () => {
    const before = await pay("before");
    expect(await earnerOf(before)).toBe(placeholder.user.id);

    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: {
        code: CODE,
        targetUser: creator.email.toUpperCase(),
        dryRun: false,
      },
      toolExecutionContext: undefined,
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.dryRunApplied).toBe(false);
    expect(res.data.referralsMoved).toBe(1);
    expect(res.data.linksMoved).toBe(1);
    expect(await ownerOf()).toBe(creator.user.id);

    const [link] = await db
      .select({
        owner: growthCampaignLinks.createdByUserId,
        refCode: growthCampaignLinks.refCode,
      })
      .from(growthCampaignLinks)
      .where(eq(growthCampaignLinks.id, linkId));
    expect(link?.owner).toBe(creator.user.id);
    expect(link?.refCode).toBe(CODE);

    // History untouched
    expect(await earnerOf(before)).toBe(placeholder.user.id);

    // Next payment pays the new owner
    const after = await pay("after");
    expect(await earnerOf(after)).toBe(creator.user.id);

    // Audit note on both accounts
    const notes = await db
      .select({ userId: userNotes.userId, content: userNotes.content })
      .from(userNotes)
      .where(eq(userNotes.userId, creator.user.id));
    expect(notes.some((n) => n.content.includes(CODE))).toBe(true);
    const oldNotes = await db
      .select({ content: userNotes.content })
      .from(userNotes)
      .where(eq(userNotes.userId, placeholder.user.id));
    expect(oldNotes.some((n) => n.content.includes(CODE))).toBe(true);
  });

  it("refuses when the target already owns the code", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, targetUser: creator.email, dryRun: false },
      toolExecutionContext: undefined,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errorType).toBe(ErrorResponseTypes.CONFLICT);
    }
  });

  it("refuses an unknown code", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: {
        code: `NOPE${stamp}`,
        targetUser: creator.email,
        dryRun: false,
      },
      toolExecutionContext: undefined,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errorType).toBe(ErrorResponseTypes.NOT_FOUND);
    }
  });

  it("refuses an unknown target user", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: {
        code: CODE,
        targetUser: `nobody-${stamp}@example.com`,
        dryRun: false,
      },
      toolExecutionContext: undefined,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errorType).toBe(ErrorResponseTypes.NOT_FOUND);
    }
    expect(await ownerOf()).toBe(creator.user.id);
  });

  it("keeps a self-referral with the previous owner", async () => {
    // Buyer was referred by this code; moving it to the buyer must not make
    // the buyer their own referrer.
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, targetUser: buyer.email, dryRun: false },
      toolExecutionContext: undefined,
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.referralsMoved).toBe(0);
    expect(res.data.selfReferralsKept).toBe(1);
    const [ref] = await db
      .select({ referrer: userReferrals.referrerUserId })
      .from(userReferrals)
      .where(eq(userReferrals.referredUserId, buyer.user.id));
    expect(ref?.referrer).toBe(creator.user.id);
  });

  it("rejects non-admin callers", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, targetUser: creator.email, dryRun: true },
      user: creator.user,
      toolExecutionContext: undefined,
    });
    expect(res.success).toBe(false);
  });
});
