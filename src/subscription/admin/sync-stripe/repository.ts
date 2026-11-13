/**
 * Subscription Stripe Sync Repository
 * Pulls status / period / cancellation fields from Stripe into our subscription
 * rows. Repair tool for rows that drifted (missed or out-of-order webhooks).
 * Never grants or revokes credits: it only rewrites subscription columns.
 */

import "server-only";

import { eq, notInArray, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import type Stripe from "stripe";

import { PaymentProvider } from "@/payment/enum";
import { StripeProvider } from "@/payment/providers/stripe/repository";
import { type Subscription, subscriptions } from "@/subscription/db";
import {
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "@/subscription/enum";

import type {
  SubscriptionSyncStripeRequestOutput,
  SubscriptionSyncStripeResponseOutput,
} from "./definition";
import {
  SubscriptionSyncAction,
  type SubscriptionSyncActionValue,
} from "./enum";
import type { SubscriptionSyncStripeT } from "./i18n";

type SyncItem = SubscriptionSyncStripeResponseOutput["items"][number];

/** Provider-agnostic snapshot of the Stripe fields we mirror. */
export interface StripeSubscriptionSnapshot {
  id: string;
  status: Stripe.Subscription.Status;
  /** Unix seconds, null when Stripe gives no item period. */
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  cancelAt: number | null;
  canceledAt: number | null;
  endedAt: number | null;
}

export type StripeLookupResult =
  | { kind: "found"; subscription: StripeSubscriptionSnapshot }
  | { kind: "missing" }
  | { kind: "error"; message: string };

/** Fetches one Stripe subscription. Injectable so tests never hit Stripe. */
export type StripeSubscriptionFetcher = (
  stripeSubscriptionId: string,
) => Promise<StripeLookupResult>;

const STRIPE_STATUS_MAP: Record<
  Stripe.Subscription.Status,
  typeof SubscriptionStatusValue
> = {
  active: SubscriptionStatus.ACTIVE,
  trialing: SubscriptionStatus.TRIALING,
  canceled: SubscriptionStatus.CANCELED,
  incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
  past_due: SubscriptionStatus.PAST_DUE,
  unpaid: SubscriptionStatus.UNPAID,
  paused: SubscriptionStatus.PAUSED,
  incomplete: SubscriptionStatus.INCOMPLETE,
};

/** Statuses the all-mode scan skips: nothing on Stripe's side changes them. */
const TERMINAL_STATUSES: (typeof SubscriptionStatusValue)[] = [
  SubscriptionStatus.CANCELED,
  SubscriptionStatus.INCOMPLETE_EXPIRED,
];

/** A canceled row only ever moves to a live status, never to past_due etc. */
const REVIVING_STATUSES: (typeof SubscriptionStatusValue)[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.CANCELED,
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toDate(unixSeconds: number | null): Date | null {
  return unixSeconds === null ? null : new Date(unixSeconds * 1000);
}

function sameDate(a: Date | null, b: Date | null): boolean {
  return (a?.getTime() ?? null) === (b?.getTime() ?? null);
}

/** Live Stripe fetcher (StripeProvider client). */
export const liveStripeFetcher: StripeSubscriptionFetcher = async (
  stripeSubscriptionId,
) => {
  const stripe = StripeProvider.getStripe();
  if (!stripe) {
    return { kind: "error", message: "stripe-not-configured" };
  }
  try {
    const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const item = sub.items.data[0];
    return {
      kind: "found",
      subscription: {
        id: sub.id,
        status: sub.status,
        currentPeriodStart: item?.current_period_start ?? null,
        currentPeriodEnd: item?.current_period_end ?? null,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        cancelAt: sub.cancel_at,
        canceledAt: sub.canceled_at,
        endedAt: sub.ended_at,
      },
    };
  } catch (error) {
    const message = parseError(error).message;
    if (
      message.includes("resource_missing") ||
      message.includes("No such subscription")
    ) {
      return { kind: "missing" };
    }
    return { kind: "error", message };
  }
};

export class SubscriptionSyncStripeRepository {
  static async sync(
    data: SubscriptionSyncStripeRequestOutput,
    logger: EndpointLogger,
    t: SubscriptionSyncStripeT,
    fetchStripe: StripeSubscriptionFetcher = liveStripeFetcher,
  ): Promise<ResponseType<SubscriptionSyncStripeResponseOutput>> {
    const target = data.subscriptionId?.trim() || null;
    if (!target && !data.all) {
      return fail({
        message: t("post.errors.validation.description"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    if (fetchStripe === liveStripeFetcher && !StripeProvider.getStripe()) {
      return fail({
        message: t("post.errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    try {
      const rows = await SubscriptionSyncStripeRepository.loadRows(target);
      if (target && rows.length === 0) {
        return fail({
          message: t("post.errors.notFound.detail", { id: target }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const items: SyncItem[] = [];
      // Sequential: a handful of rows, and it keeps us far from Stripe rate limits.
      for (const { subscription, userEmail } of rows) {
        items.push(
          await SubscriptionSyncStripeRepository.syncRow(
            subscription,
            userEmail,
            data.dryRun,
            fetchStripe,
            logger,
            t,
          ),
        );
      }

      const changedActions: (typeof SubscriptionSyncActionValue)[] = [
        SubscriptionSyncAction.UPDATED,
        SubscriptionSyncAction.EXPIRED,
        SubscriptionSyncAction.MISSING_IN_STRIPE,
      ];
      const result = {
        dryRunResult: data.dryRun,
        scanned: items.length,
        changed: items.filter((i) => changedActions.includes(i.action)).length,
        failed: items.filter((i) => i.action === SubscriptionSyncAction.ERROR)
          .length,
        items,
      };
      logger.info("Subscription Stripe sync finished", {
        dryRun: data.dryRun,
        scanned: result.scanned,
        changed: result.changed,
        failed: result.failed,
      });
      return success(result);
    } catch (error) {
      logger.error("Subscription Stripe sync failed", parseError(error));
      return fail({
        message: t("post.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async loadRows(
    target: string | null,
  ): Promise<{ subscription: Subscription; userEmail: string | null }[]> {
    const where = target
      ? UUID_REGEX.test(target)
        ? or(
            eq(subscriptions.id, target),
            eq(subscriptions.providerSubscriptionId, target),
          )
        : eq(subscriptions.providerSubscriptionId, target)
      : notInArray(subscriptions.status, TERMINAL_STATUSES);

    const rows = await db
      .select({ subscription: subscriptions, userEmail: users.email })
      .from(subscriptions)
      .leftJoin(users, eq(users.id, subscriptions.userId))
      .where(where)
      .orderBy(subscriptions.createdAt);
    return rows;
  }

  private static async syncRow(
    sub: Subscription,
    userEmail: string | null,
    dryRun: boolean,
    fetchStripe: StripeSubscriptionFetcher,
    logger: EndpointLogger,
    t: SubscriptionSyncStripeT,
  ): Promise<SyncItem> {
    const base = {
      subscriptionId: sub.id,
      userEmail,
      providerSubscriptionId: sub.providerSubscriptionId,
      statusBefore: sub.status,
      periodEndBefore: sub.currentPeriodEnd,
    };
    const unchanged = (
      action: typeof SubscriptionSyncActionValue,
      note: string | null,
    ): SyncItem => ({
      ...base,
      action,
      statusAfter: sub.status,
      periodEndAfter: sub.currentPeriodEnd,
      note,
    });

    // No Stripe id: legacy/test rows. Expire them once their period ended.
    if (!sub.providerSubscriptionId) {
      const now = new Date();
      const ended = sub.currentPeriodEnd !== null && sub.currentPeriodEnd < now;
      if (!ended || TERMINAL_STATUSES.includes(sub.status)) {
        return unchanged(
          SubscriptionSyncAction.SKIPPED,
          t("post.notes.noStripeIdActivePeriod"),
        );
      }
      if (!dryRun) {
        await db
          .update(subscriptions)
          .set({
            status: SubscriptionStatus.CANCELED,
            canceledAt: sub.canceledAt ?? now,
            endedAt: sub.endedAt ?? sub.currentPeriodEnd,
            cancelAtPeriodEnd: false,
            updatedAt: now,
          })
          .where(eq(subscriptions.id, sub.id));
      }
      return {
        ...base,
        action: SubscriptionSyncAction.EXPIRED,
        statusAfter: SubscriptionStatus.CANCELED,
        periodEndAfter: sub.currentPeriodEnd,
        note: t("post.notes.expiredLegacy", {
          date: sub.currentPeriodEnd?.toISOString().slice(0, 10) ?? "",
        }),
      };
    }

    if (sub.provider !== PaymentProvider.STRIPE) {
      return unchanged(
        SubscriptionSyncAction.SKIPPED,
        t("post.notes.notStripe"),
      );
    }

    const lookup = await fetchStripe(sub.providerSubscriptionId);

    if (lookup.kind === "error") {
      logger.error("Stripe lookup failed during subscription sync", {
        subscriptionId: sub.id,
        providerSubscriptionId: sub.providerSubscriptionId,
        error: lookup.message,
      });
      return unchanged(
        SubscriptionSyncAction.ERROR,
        t("post.notes.stripeError", { error: lookup.message }),
      );
    }

    if (lookup.kind === "missing") {
      const now = new Date();
      if (!dryRun) {
        await db
          .update(subscriptions)
          .set({
            status: SubscriptionStatus.CANCELED,
            canceledAt: sub.canceledAt ?? now,
            endedAt: sub.endedAt ?? sub.currentPeriodEnd ?? now,
            providerSubscriptionId: null,
            updatedAt: now,
          })
          .where(eq(subscriptions.id, sub.id));
      }
      return {
        ...base,
        action: SubscriptionSyncAction.MISSING_IN_STRIPE,
        statusAfter: SubscriptionStatus.CANCELED,
        periodEndAfter: sub.currentPeriodEnd,
        note: t("post.notes.missingInStripe"),
      };
    }

    const stripeSub = lookup.subscription;
    const mapped = STRIPE_STATUS_MAP[stripeSub.status];
    const keepCanceled =
      sub.status === SubscriptionStatus.CANCELED &&
      !REVIVING_STATUSES.includes(mapped);

    const next = keepCanceled
      ? {
          status: sub.status,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          cancelAt: sub.cancelAt,
          canceledAt: sub.canceledAt,
          endedAt: sub.endedAt,
        }
      : {
          status: mapped,
          // Stripe dropped the item period (rare): keep ours.
          currentPeriodStart:
            toDate(stripeSub.currentPeriodStart) ?? sub.currentPeriodStart,
          currentPeriodEnd:
            toDate(stripeSub.currentPeriodEnd) ?? sub.currentPeriodEnd,
          cancelAtPeriodEnd: stripeSub.cancelAtPeriodEnd,
          cancelAt: toDate(stripeSub.cancelAt),
          canceledAt: toDate(stripeSub.canceledAt),
          endedAt: toDate(stripeSub.endedAt),
        };

    const changed =
      next.status !== sub.status ||
      !sameDate(next.currentPeriodStart, sub.currentPeriodStart) ||
      !sameDate(next.currentPeriodEnd, sub.currentPeriodEnd) ||
      next.cancelAtPeriodEnd !== sub.cancelAtPeriodEnd ||
      !sameDate(next.cancelAt, sub.cancelAt) ||
      !sameDate(next.canceledAt, sub.canceledAt) ||
      !sameDate(next.endedAt, sub.endedAt);

    const note = keepCanceled
      ? t("post.notes.keptCanceled", { stripeStatus: stripeSub.status })
      : null;

    if (!changed) {
      return unchanged(SubscriptionSyncAction.UNCHANGED, note);
    }

    if (!dryRun) {
      const isLive =
        next.status === SubscriptionStatus.ACTIVE ||
        next.status === SubscriptionStatus.TRIALING;
      await db
        .update(subscriptions)
        .set({
          ...next,
          // A paying subscription has no failed-payment grace window.
          ...(isLive ? { paymentFailedAt: null, gracePeriodEndsAt: null } : {}),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, sub.id));
      logger.info("Subscription synced from Stripe", {
        subscriptionId: sub.id,
        providerSubscriptionId: sub.providerSubscriptionId,
        statusBefore: sub.status,
        statusAfter: next.status,
      });
    }

    return {
      ...base,
      action: SubscriptionSyncAction.UPDATED,
      statusAfter: next.status,
      periodEndAfter: next.currentPeriodEnd,
      note,
    };
  }
}
