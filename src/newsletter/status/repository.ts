/**
 * Newsletter Status Repository
 * Handles newsletter subscription status checks
 */

import "server-only";

import { eq, inArray, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { db } from "../../vibe/database";
import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import type {
  StatusGetRequestOutput,
  StatusGetResponseOutput,
} from "./definition";
import type { NewsletterStatusT } from "./i18n";

type StatusRow = Pick<
  typeof newsletterSubscriptions.$inferSelect,
  "id" | "email" | "status" | "confirmedAt"
>;

const NOT_SUBSCRIBED: StatusGetResponseOutput = {
  subscribed: false,
  status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
  confirmed: false,
};

/** Confirmed subscriber > pending confirmation > anything else. */
function rankRow(row: StatusRow): number {
  if (row.status !== NewsletterSubscriptionStatus.SUBSCRIBED) {
    return 0;
  }
  return row.confirmedAt ? 2 : 1;
}

export class NewsletterStatusRepository {
  static async getStatus(
    data: StatusGetRequestOutput,
    user: JwtPayloadType,
    t: NewsletterStatusT,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatusGetResponseOutput>> {
    try {
      if (!data.email) {
        return success(
          await NewsletterStatusRepository.getOwnStatus(user, logger),
        );
      }

      logger.debug("Getting newsletter subscription status", {
        email: data.email,
      });

      const [subscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, data.email))
        .limit(1);

      if (!subscription) {
        logger.debug("No subscription found for email", {
          email: data.email,
        });
        return success(NOT_SUBSCRIBED);
      }

      const isSubscribed =
        subscription.status === NewsletterSubscriptionStatus.SUBSCRIBED;

      logger.debug(
        isSubscribed
          ? "User is subscribed to newsletter"
          : "User is unsubscribed from newsletter",
        {
          email: data.email,
          status: subscription.status,
          subscriptionId: subscription.id,
        },
      );

      return success({
        subscribed: isSubscribed,
        status: subscription.status,
        confirmed: isSubscribed && subscription.confirmedAt !== null,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get newsletter status", {
        error: parsedError.message,
        email: data.email,
      });

      return fail({
        message: t("errors.internal.detail", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * The caller's own subscription, used to make every newsletter prompt
   * state-aware (and by layouts for SSR so nothing flashes).
   * Accounts: account email, user id, own + linked leads.
   * Guests: their lead only.
   * Throws on DB errors; getStatus wraps it.
   */
  static async getOwnStatus(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<StatusGetResponseOutput> {
    const leadIds: string[] = [user.leadId];
    let accountEmail: string | undefined;

    if (!user.isPublic) {
      const [[account], links] = await Promise.all([
        db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1),
        db
          .select({ leadId: userLeadLinks.leadId })
          .from(userLeadLinks)
          .where(eq(userLeadLinks.userId, user.id)),
      ]);
      accountEmail = account?.email;
      for (const link of links) {
        if (!leadIds.includes(link.leadId)) {
          leadIds.push(link.leadId);
        }
      }
    }

    const conditions = [
      inArray(newsletterSubscriptions.leadId, leadIds),
      ...(user.isPublic ? [] : [eq(newsletterSubscriptions.userId, user.id)]),
      ...(accountEmail
        ? [eq(newsletterSubscriptions.email, accountEmail)]
        : []),
    ];

    const rows: StatusRow[] = await db
      .select({
        id: newsletterSubscriptions.id,
        email: newsletterSubscriptions.email,
        status: newsletterSubscriptions.status,
        confirmedAt: newsletterSubscriptions.confirmedAt,
      })
      .from(newsletterSubscriptions)
      .where(or(...conditions));

    const best = rows.reduce<StatusRow | undefined>(
      (top, row) => (!top || rankRow(row) > rankRow(top) ? row : top),
      undefined,
    );

    logger.debug("Own newsletter status resolved", {
      isPublic: user.isPublic,
      rows: rows.length,
      subscriptionId: best?.id,
      status: best?.status,
    });

    if (!best) {
      return { ...NOT_SUBSCRIBED, subscriptionEmail: accountEmail };
    }
    const subscribed = best.status === NewsletterSubscriptionStatus.SUBSCRIBED;
    return {
      subscribed,
      status: best.status,
      confirmed: subscribed && best.confirmedAt !== null,
      // A pending row needs its address for "resend"; otherwise the account email
      subscriptionEmail: subscribed ? best.email : accountEmail,
    };
  }

  /** SSR helper for layouts: never fails a page render. */
  static async getOwnStatusSafe(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<StatusGetResponseOutput | undefined> {
    try {
      return await NewsletterStatusRepository.getOwnStatus(user, logger);
    } catch (error) {
      logger.error("Own newsletter status lookup failed", {
        error: parseError(error).message,
        isPublic: user.isPublic,
      });
      return undefined;
    }
  }
}
