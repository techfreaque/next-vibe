/**
 * Transactional "payment failed" notices.
 *
 * Source of truth is the subscription row the payment webhook already writes
 * (status PAST_DUE + payment_failed_at + grace_period_ends_at). No payment code
 * calls into here: the lifecycle run reads that state every 15 minutes.
 *
 * One email per dunning episode (subscription + payment_failed_at; Stripe
 * retries of the same invoice keep payment_failed_at, a paid invoice clears
 * it). The lifecycle_billing_notices row is claimed BEFORE the mail leaves, so
 * concurrent runs (S1/S2) and retries never double-send. Not counted against
 * the marketing frequency cap; marketing opt-outs do not apply, bounces do.
 */

import "server-only";

import { and, eq, gt, inArray, isNotNull, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import { lifecycleBillingNotices } from "./db";
import { canSendBillingNotice } from "./eligibility";
import { renderLifecycleEmail } from "./emails";
import { LifecycleSendStatus, LifecycleTemplate } from "./enum";
import { loadSnapshots, normalizeEmail } from "./snapshots";
import type { LifecycleTransport } from "./transport";

export interface BillingNoticeResult {
  sent: number;
  failed: number;
  skipped: number;
}

export async function sendPaymentFailedNotices(opts: {
  now: Date;
  transport: LifecycleTransport;
  logger: EndpointLogger;
  onlyEmails?: readonly string[];
}): Promise<BillingNoticeResult> {
  const result: BillingNoticeResult = { sent: 0, failed: 0, skipped: 0 };
  const onlyEmails = opts.onlyEmails?.map(normalizeEmail);
  const due = await db
    .select({
      subscriptionId: subscriptions.id,
      userId: subscriptions.userId,
      paymentFailedAt: subscriptions.paymentFailedAt,
      gracePeriodEndsAt: subscriptions.gracePeriodEndsAt,
      email: users.email,
    })
    .from(subscriptions)
    .innerJoin(users, eq(users.id, subscriptions.userId))
    .where(
      and(
        eq(subscriptions.status, SubscriptionStatus.PAST_DUE),
        isNotNull(subscriptions.paymentFailedAt),
        gt(subscriptions.gracePeriodEndsAt, opts.now),
        onlyEmails
          ? inArray(sql`lower(${users.email})`, onlyEmails)
          : undefined,
      ),
    );
  if (due.length === 0) {
    return result;
  }

  const notified = await db
    .select({
      subscriptionId: lifecycleBillingNotices.subscriptionId,
      episodeKey: lifecycleBillingNotices.episodeKey,
    })
    .from(lifecycleBillingNotices)
    .where(
      inArray(
        lifecycleBillingNotices.subscriptionId,
        due.map((d) => d.subscriptionId),
      ),
    );
  const done = new Set(
    notified.map((n) => `${n.subscriptionId}|${n.episodeKey}`),
  );
  const pending = due.filter(
    (d) =>
      d.paymentFailedAt !== null &&
      !done.has(`${d.subscriptionId}|${d.paymentFailedAt.toISOString()}`),
  );
  if (pending.length === 0) {
    return result;
  }
  const snapshots = await loadSnapshots(pending.map((d) => d.email));

  for (const row of pending) {
    const email = normalizeEmail(row.email);
    const snapshot = snapshots.get(email);
    if (!row.paymentFailedAt || !snapshot || !canSendBillingNotice(snapshot)) {
      result.skipped += 1;
      continue;
    }
    const claimed = await db
      .insert(lifecycleBillingNotices)
      .values({
        subscriptionId: row.subscriptionId,
        episodeKey: row.paymentFailedAt.toISOString(),
        email,
      })
      .onConflictDoNothing()
      .returning({ id: lifecycleBillingNotices.id });
    if (claimed.length === 0) {
      result.skipped += 1;
      continue;
    }
    const noticeId = claimed[0].id;
    try {
      const locale = snapshot.locale ?? defaultLocale;
      const rendered = await renderLifecycleEmail({
        template: LifecycleTemplate.PAYMENT_FAILED,
        locale,
        email,
        leadId: snapshot.leadId,
        userId: row.userId,
        name: snapshot.name,
        baseUrl: coreEnv.NEXT_PUBLIC_APP_URL,
        lastActiveAt: null,
        marketingOk: false,
        graceEndsAt: row.gracePeriodEndsAt,
        now: opts.now,
      });
      const sent = await opts.transport.send(
        {
          to: email,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          locale,
          newsletterOnly: false,
          transactional: true,
          leadId: snapshot.leadId,
          unsubscribeUrl: rendered.unsubscribeUrl,
          senderName: rendered.senderName,
        },
        opts.logger,
      );
      if (!sent.success) {
        await releaseClaim(
          noticeId,
          row.subscriptionId,
          sent.message,
          opts.logger,
        );
        result.failed += 1;
        continue;
      }
      await db
        .update(lifecycleBillingNotices)
        .set({
          status: LifecycleSendStatus.SENT,
          messageId: sent.data.messageId,
          sentAt: opts.now,
        })
        .where(eq(lifecycleBillingNotices.id, noticeId));
      result.sent += 1;
    } catch (error) {
      await releaseClaim(
        noticeId,
        row.subscriptionId,
        parseError(error).message,
        opts.logger,
      );
      result.failed += 1;
    }
  }
  return result;
}

/** Release a failed claim: the next run retries while the grace period lasts. */
async function releaseClaim(
  noticeId: string,
  subscriptionId: string,
  message: string,
  logger: EndpointLogger,
): Promise<void> {
  logger.error("lifecycle.billingNotice.failed", { subscriptionId, message });
  await db
    .delete(lifecycleBillingNotices)
    .where(eq(lifecycleBillingNotices.id, noticeId));
}
