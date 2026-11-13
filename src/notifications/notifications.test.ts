/**
 * Notifications - integration tests (real DB).
 *
 * - A finished background task notifies its owner only, once.
 * - A failed task notifies as TASK_FAILED; a live WAIT result does not notify.
 * - A confirmed referral earning notifies the earner once.
 * - list is unread-first and per-user; mark-read (one / all) is per-user.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { CallbackMode } from "next-vibe/execute-tool/constants";
import { TaskCompletion } from "next-vibe/execute-tool/repository/completion";
import { createEndpointLogger } from "next-vibe/logger/server";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { REFERRAL_CONFIG } from "@/referral/config";
import { referralCodes, userReferrals } from "@/referral/db";
import { ReferralRepository } from "@/referral/repository";

import { notifications } from "./db";
import { NotificationType } from "./enum";
import { scopedTranslation } from "./i18n";
import { NotificationsRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const { t } = scopedTranslation.scopedT(defaultLocale);
const stamp = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

let owner: TestUser;
let other: TestUser;

async function rowsFor(userId: string): Promise<(typeof notifications.$inferSelect)[]> {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId));
}

async function finishTask(
  taskId: string,
  status: string,
  callbackMode: (typeof CallbackMode)[keyof typeof CallbackMode],
): Promise<void> {
  await TaskCompletion.handle({
    toolMessageId: "",
    threadId: null,
    callbackMode,
    status,
    output: { ok: true },
    taskId,
    ownerUser: owner.user,
    logger,
    abortSignal: new AbortController().signal,
    subAgentDepth: 0,
  });
}

describe("Notifications", () => {
  beforeAll(async () => {
    const a = await createTestUser(`notif-owner-${stamp}@example.com`);
    const b = await createTestUser(`notif-other-${stamp}@example.com`);
    expect(a.success && b.success).toBe(true);
    if (!a.success || !b.success) {
      return;
    }
    owner = a.data;
    other = b.data;
  });

  afterAll(async () => {
    await deleteTestUser(owner.user.id);
    await deleteTestUser(other.user.id);
  });

  it("a completed detached task notifies the owner, not others, once", async () => {
    const taskId = `notif-task-ok-${stamp}`;
    await finishTask(taskId, CronTaskStatus.COMPLETED, CallbackMode.DETACH);
    await finishTask(taskId, CronTaskStatus.COMPLETED, CallbackMode.DETACH); // dedupe

    const mine = (await rowsFor(owner.user.id)).filter(
      (n) => n.dedupeKey === `task:${taskId}`,
    );
    expect(mine).toHaveLength(1);
    expect(mine[0]?.type).toBe(NotificationType.TASK_COMPLETE);
    expect(mine[0]?.read).toBe(false);
    expect(await rowsFor(other.user.id)).toHaveLength(0);
  });

  it("a failed task notifies as TASK_FAILED; a live WAIT result does not notify", async () => {
    const failedId = `notif-task-fail-${stamp}`;
    await finishTask(failedId, CronTaskStatus.FAILED, CallbackMode.END_LOOP);
    const waitId = `notif-task-wait-${stamp}`;
    await finishTask(waitId, CronTaskStatus.COMPLETED, CallbackMode.WAIT);

    const rows = await rowsFor(owner.user.id);
    const failed = rows.find((n) => n.dedupeKey === `task:${failedId}`);
    expect(failed?.type).toBe(NotificationType.TASK_FAILED);
    expect(rows.find((n) => n.dedupeKey === `task:${waitId}`)).toBeUndefined();
  });

  it("list is unread-first and per-user; unread-count matches", async () => {
    // Make the OLDEST notification read so unread-first ordering is observable
    const rows = await rowsFor(owner.user.id);
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const newest = rows.toSorted(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, newest?.id ?? ""));

    const list = await NotificationsRepository.list(
      { paginationInfo: { page: 1, limit: 20 } },
      owner.user,
      logger,
      t,
    );
    expect(list.success).toBe(true);
    if (!list.success) {
      return;
    }
    const reads = list.data.notifications.map((n) => n.read);
    expect(reads).toEqual(reads.toSorted((a, b) => Number(a) - Number(b)));
    expect(list.data.unreadCount).toBe(rows.length - 1);

    const count = await NotificationsRepository.unreadCount(owner.user, logger, t);
    expect(count.success && count.data.unreadCount).toBe(rows.length - 1);

    const otherList = await NotificationsRepository.list(
      { paginationInfo: { page: 1, limit: 20 } },
      other.user,
      logger,
      t,
    );
    expect(otherList.success && otherList.data.notifications).toHaveLength(0);
  });

  it("mark-read: one by id (own only), then all", async () => {
    const [unread] = (await rowsFor(owner.user.id)).filter((n) => !n.read);
    expect(unread).toBeDefined();

    // Another user cannot mark it
    const foreign = await NotificationsRepository.markRead(
      { id: unread?.id },
      other.user,
      logger,
      t,
    );
    expect(foreign.success && foreign.data.updatedCount).toBe(0);

    const one = await NotificationsRepository.markRead(
      { id: unread?.id },
      owner.user,
      logger,
      t,
    );
    expect(one.success && one.data.updatedCount).toBe(1);

    const none = await NotificationsRepository.markRead({}, owner.user, logger, t);
    expect(none.success).toBe(false);

    await NotificationsRepository.notify(
      {
        userId: owner.user.id,
        type: NotificationType.SYSTEM,
        params: { name: "Heads up" },
        link: null,
        dedupeKey: `system:${stamp}`,
      },
      logger,
    );
    const all = await NotificationsRepository.markRead(
      { all: true },
      owner.user,
      logger,
      t,
    );
    expect(all.success && all.data.updatedCount).toBe(1);
    const count = await NotificationsRepository.unreadCount(owner.user, logger, t);
    expect(count.success && count.data.unreadCount).toBe(0);
  });

  it("a confirmed referral earning notifies the earner, once", async () => {
    const [code] = await db
      .insert(referralCodes)
      .values({ code: `NOTIF${stamp}`, ownerUserId: other.user.id })
      .returning({ id: referralCodes.id });
    await db.insert(userReferrals).values({
      referrerUserId: other.user.id,
      referredUserId: owner.user.id,
      referralCodeId: code.id,
    });
    const [tx] = await db
      .insert(paymentTransactions)
      .values({
        userId: owner.user.id,
        providerSessionId: `cs_test_notif_${stamp}`,
        amount: "50.00",
        currency: "USD",
        status: PaymentStatus.SUCCEEDED,
      })
      .returning({ id: paymentTransactions.id });
    const applied = await ReferralRepository.applyReferralPayoutOnPayment(
      tx.id,
      owner.user.id,
      10_000,
      logger,
      defaultLocale,
    );
    expect(applied.success).toBe(true);
    expect(await rowsFor(other.user.id)).toHaveLength(0); // pending: silent

    const later = new Date(
      Date.now() + (REFERRAL_CONFIG.EARNING_HOLD_DAYS + 1) * DAY_MS,
    );
    await ReferralRepository.confirmMaturedEarnings(logger, creditsT, later);
    await ReferralRepository.confirmMaturedEarnings(logger, creditsT, later);

    const earnings = (await rowsFor(other.user.id)).filter(
      (n) => n.type === NotificationType.EARNING,
    );
    expect(earnings).toHaveLength(1);
    expect(earnings[0]?.link).toBe("/user/referral");
    expect(earnings[0]?.title).toContain("1000");
    expect(await rowsFor(owner.user.id).then((r) => r.filter((n) => n.type === NotificationType.EARNING))).toHaveLength(0);
  });
});
