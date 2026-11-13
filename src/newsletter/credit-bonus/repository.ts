/**
 * Newsletter Credit Bonus Repository
 *
 * Account first: the monthly newsletter credit bonus belongs to signed-in
 * accounts only (credits/free-allowance.ts). One bonus per account and email:
 * the claim always uses the account's own email, a subscription owned by another
 * pool is never re-assigned, and an account that ever had the bonus is never
 * offered it again, so unsubscribe/resubscribe cannot farm it. Ticking the
 * newsletter box at signup creates a real (pending) subscription, so it shows
 * up here as PENDING_CONFIRMATION / ACTIVE like any other.
 */

import "server-only";

import { eq, inArray, or } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configScopedTranslation } from "@/env/i18n";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { newsletterSubscriptions } from "../db";
import { NewsletterCreditBonus, NewsletterSubscriptionStatus } from "../enum";
import type { SubscribePostResponseOutput } from "../subscribe/definition";
import { newsletterWelcomeEmailTemplate } from "../subscribe/email";
import { scopedTranslation as subscribeScopedTranslation } from "../subscribe/i18n";
import { NewsletterSubscribeRepository } from "../subscribe/repository";
import type {
  CreditBonusGetResponseOutput,
  CreditBonusPostResponseOutput,
} from "./definition";
import { NewsletterCreditOffer, type NewsletterCreditOfferValue } from "./enum";
import type { NewsletterCreditBonusT } from "./i18n";

export type SubscriptionRow = Pick<
  typeof newsletterSubscriptions.$inferSelect,
  "email" | "userId" | "leadId" | "status" | "confirmedAt"
>;

/** First day of next month, the free allowance's period boundary. */
export function getNextFreeRefill(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

/**
 * Pure offer decision, exported for tests.
 * @param rows subscriptions matching the account email, user id or pool leads
 */
export function decideCreditOffer({
  rows,
  userId,
  leadIds,
  accountEmail,
}: {
  rows: SubscriptionRow[];
  userId: string;
  leadIds: string[];
  accountEmail: string;
}): typeof NewsletterCreditOfferValue {
  const owned = rows.filter(
    (row) =>
      row.userId === userId ||
      (row.leadId !== null && leadIds.includes(row.leadId)) ||
      (row.userId === null && row.leadId === null),
  );
  const isSubscribed = (row: SubscriptionRow): boolean =>
    row.status === NewsletterSubscriptionStatus.SUBSCRIBED;

  if (owned.some((row) => isSubscribed(row) && row.confirmedAt)) {
    return NewsletterCreditOffer.ACTIVE;
  }
  // Had the bonus once (confirmed, since unsubscribed): never offered again
  if (owned.some((row) => row.confirmedAt)) {
    return NewsletterCreditOffer.NOT_ELIGIBLE;
  }
  // The account email's subscription belongs to another pool
  const emailKey = accountEmail.toLowerCase();
  if (
    rows.some(
      (row) => row.email.toLowerCase() === emailKey && !owned.includes(row),
    )
  ) {
    return NewsletterCreditOffer.NOT_ELIGIBLE;
  }
  if (owned.some(isSubscribed)) {
    return NewsletterCreditOffer.PENDING_CONFIRMATION;
  }
  return NewsletterCreditOffer.AVAILABLE;
}

interface AccountContext {
  userId: string;
  email: string;
  leadIds: string[];
}

export class NewsletterCreditBonusRepository {
  static async getOffer(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: NewsletterCreditBonusT,
  ): Promise<ResponseType<CreditBonusGetResponseOutput>> {
    const account = await NewsletterCreditBonusRepository.loadAccount(
      user,
      logger,
      t,
      "get",
    );
    if (!account.success) {
      return account;
    }
    try {
      const offer = await NewsletterCreditBonusRepository.resolveOffer(
        account.data,
      );
      return success(
        NewsletterCreditBonusRepository.toResponse(account.data, offer),
      );
    } catch (error) {
      logger.error("Newsletter credit bonus lookup failed", {
        error: parseError(error).message,
        userId: account.data.userId,
      });
      return fail({
        message: t("errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async claim(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: NewsletterCreditBonusT,
  ): Promise<ResponseType<CreditBonusPostResponseOutput>> {
    const account = await NewsletterCreditBonusRepository.loadAccount(
      user,
      logger,
      t,
      "claim",
    );
    if (!account.success) {
      return account;
    }
    try {
      const current = await NewsletterCreditBonusRepository.resolveOffer(
        account.data,
      );
      if (current !== NewsletterCreditOffer.AVAILABLE) {
        // Idempotent: nothing to grant, report where the account stands
        logger.info("Newsletter credit bonus claim skipped", {
          userId: account.data.userId,
          offer: current,
        });
        return success(
          NewsletterCreditBonusRepository.toResponse(account.data, current),
        );
      }

      const { t: subscribeT } = subscribeScopedTranslation.scopedT(locale);
      const requestData = { email: account.data.email };
      const subscribed = await NewsletterSubscribeRepository.subscribe(
        requestData,
        user,
        locale,
        logger,
        subscribeT,
      );
      if (!subscribed.success) {
        return subscribed;
      }

      // Double opt-in: the welcome email carries the confirm link
      await NewsletterCreditBonusRepository.sendWelcomeEmail(
        account.data,
        subscribed.data,
        locale,
        logger,
      );

      const offer =
        subscribed.data.creditBonus === NewsletterCreditBonus.ACTIVE
          ? NewsletterCreditOffer.ACTIVE
          : subscribed.data.creditBonus ===
              NewsletterCreditBonus.PENDING_CONFIRMATION
            ? NewsletterCreditOffer.PENDING_CONFIRMATION
            : NewsletterCreditOffer.NOT_ELIGIBLE;
      logger.info("Newsletter credit bonus claimed", {
        userId: account.data.userId,
        subscriptionId: subscribed.data.subscriptionId,
        offer,
      });
      return success(
        NewsletterCreditBonusRepository.toResponse(account.data, offer),
      );
    } catch (error) {
      logger.error("Newsletter credit bonus claim failed", {
        error: parseError(error).message,
        userId: account.data.userId,
      });
      return fail({
        message: t("errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Same welcome email the newsletter subscribe route sends, to the account email. */
  private static async sendWelcomeEmail(
    account: AccountContext,
    subscribed: SubscribePostResponseOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const confirmationToken =
        await NewsletterSubscribeRepository.getPendingConfirmationToken(
          subscribed.subscriptionId,
        );
      const { t: subscribeT } = subscribeScopedTranslation.scopedT(locale);
      const { t: configT } = configScopedTranslation.scopedT(locale);
      const { EmailSendingRepository } =
        await import("@/messenger/providers/email/smtp-client/email-sending/repository");
      const { createTrackingContext } =
        await import("@/messenger/providers/email/smtp-client/components/tracking_context.email");
      const jsx = newsletterWelcomeEmailTemplate.component({
        props: {
          email: account.email,
          leadId: subscribed.leadId,
          userId: account.userId,
          confirmationToken: confirmationToken ?? undefined,
        },
        t: subscribeT,
        locale,
        recipientEmail: account.email,
        tracking: createTrackingContext(
          locale,
          subscribed.leadId,
          account.userId,
        ),
      });
      const sent = await EmailSendingRepository.sendEmail(
        {
          jsx,
          subject: subscribeT("emailTemplate.welcome.subject", {
            appName: configT("appName"),
          }),
          toEmail: account.email,
          toName: account.email,
          locale,
        },
        logger,
        locale,
      );
      if (!sent.success) {
        logger.error("Newsletter credit bonus: welcome email failed", {
          userId: account.userId,
          error: sent.message,
        });
      }
    } catch (error) {
      logger.error("Newsletter credit bonus: welcome email failed", {
        userId: account.userId,
        error: parseError(error).message,
      });
    }
  }

  private static toResponse(
    account: AccountContext,
    offer: typeof NewsletterCreditOfferValue,
  ): CreditBonusGetResponseOutput {
    return {
      offer,
      email: account.email,
      bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
      freeRefillAt: getNextFreeRefill(),
    };
  }

  /**
   * Guests are rejected here, not only by allowedRoles: the bonus is
   * account-only and this is the one path that grants it.
   */
  private static async loadAccount(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: NewsletterCreditBonusT,
    action: "get" | "claim",
  ): Promise<ResponseType<AccountContext>> {
    if (user.isPublic) {
      logger.warn("Newsletter credit bonus rejected: guest has no account", {
        leadId: user.leadId,
        action,
      });
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const [account] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      if (!account) {
        logger.error("Newsletter credit bonus: account row missing", {
          userId: user.id,
        });
        return fail({
          message: t("errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const links = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, user.id));
      const leadIds = [
        ...new Set([user.leadId, ...links.map((l) => l.leadId)]),
      ];
      return success({
        userId: user.id,
        email: account.email,
        leadIds,
      });
    } catch (error) {
      logger.error("Newsletter credit bonus: account lookup failed", {
        error: parseError(error).message,
        userId: user.id,
      });
      return fail({
        message: t("errors.internal.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async resolveOffer(
    account: AccountContext,
  ): Promise<typeof NewsletterCreditOfferValue> {
    const rows = await db
      .select({
        email: newsletterSubscriptions.email,
        userId: newsletterSubscriptions.userId,
        leadId: newsletterSubscriptions.leadId,
        status: newsletterSubscriptions.status,
        confirmedAt: newsletterSubscriptions.confirmedAt,
      })
      .from(newsletterSubscriptions)
      .where(
        or(
          eq(newsletterSubscriptions.email, account.email),
          eq(newsletterSubscriptions.userId, account.userId),
          inArray(newsletterSubscriptions.leadId, account.leadIds),
        ),
      );
    return decideCreditOffer({
      rows,
      userId: account.userId,
      leadIds: account.leadIds,
      accountEmail: account.email,
    });
  }
}
