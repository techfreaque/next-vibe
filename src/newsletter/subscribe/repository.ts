/**
 * Newsletter Subscribe Repository
 * Handles newsletter subscription business logic
 */

import "server-only";

import { randomBytes } from "node:crypto";

import { and, eq, ne } from "drizzle-orm";
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
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { getNewsletterSubscriptionStatus } from "next-vibe/identity/lead/enum";
import { LeadsRepository } from "next-vibe/identity/lead/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { newsletterSubscriptions } from "../db";
import {
  NewsletterCreditBonus,
  type NewsletterCreditBonusValue,
  NewsletterSubscriptionStatus,
} from "../enum";
import type {
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
} from "./definition";
import type { NewsletterSubscribeT } from "./i18n";

type NewsletterSubscriptionRow = typeof newsletterSubscriptions.$inferSelect;

export class NewsletterSubscribeRepository {
  static async subscribe(
    data: SubscribePostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: NewsletterSubscribeT,
  ): Promise<ResponseType<SubscribePostResponseOutput>> {
    try {
      // Get leadId from user prop (JWT payload) - always present
      const leadId = user.leadId;

      logger.debug("Processing newsletter subscription", {
        email: data.email,
        hasName: !!data.name,
        hasPreferences: !!data.preferences?.length,
        leadId,
      });

      // Handle lead linking using leadId from JWT
      try {
        logger.debug("Linking newsletter subscription to lead", {
          leadId,
          email: data.email,
        });

        const leadResult = await LeadsRepository.getLeadById(
          leadId,
          logger,
          locale,
        );
        if (leadResult.success) {
          logger.debug("Lead found for newsletter subscription", {
            leadId,
            email: data.email,
          });

          // Access nested data structure properly
          const currentStatus = leadResult.data.lead.basicInfo.status;
          const newStatus = getNewsletterSubscriptionStatus(currentStatus);

          // Email capture: give an anonymous lead its address so the newsletter
          // journey (scheduled on the NEWSLETTER_SUBSCRIBER transition) can reach it.
          // leads.email is unique - never steal an address another lead owns.
          const captureEmail =
            await NewsletterSubscribeRepository.resolveCapturableLeadEmail(
              leadId,
              data.email,
            );

          const updateData = {
            status: newStatus,
            ...(captureEmail ? { email: captureEmail } : {}),
            metadata: {
              ...leadResult.data.lead.metadata.metadata,
              newsletterSubscribed: true,
              newsletterSubscriptionDate: new Date().toISOString(),
              subscribedEmail: data.email,
              subscribedName: data.name || "",
            },
          };

          const updateResult = await LeadsRepository.updateLead(
            leadId,
            updateData,
            logger,
            locale,
          );

          if (updateResult.success) {
            logger.debug("Lead updated with newsletter subscription status", {
              leadId,
              email: data.email,
            });
          } else {
            logger.error(
              "Failed to update lead with newsletter subscription status",
              {
                leadId,
                email: data.email,
                error: updateResult.message,
              },
            );
          }
        } else {
          logger.debug("Lead not found for newsletter subscription", {
            leadId,
            email: data.email,
          });
        }
      } catch (error) {
        logger.error("Error linking newsletter subscription to lead", {
          error: parseError(error).message,
          leadId,
          email: data.email,
        });
      }

      // Check if already subscribed
      const [existingSubscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, data.email))
        .limit(1);

      if (existingSubscription) {
        // Claim unowned rows for this visitor (legacy rows have no owner) and
        // make sure an unconfirmed row has a token for the welcome email's link.
        const claimed = await NewsletterSubscribeRepository.claimSubscription(
          existingSubscription,
          user,
        );
        const creditBonus = await NewsletterSubscribeRepository.getCreditBonus(
          claimed,
          user,
        );

        if (
          existingSubscription.status ===
          NewsletterSubscriptionStatus.SUBSCRIBED
        ) {
          logger.debug("Email already subscribed to newsletter", {
            email: data.email,
            subscriptionId: existingSubscription.id,
          });
          return success({
            success: true,
            message: t("response.alreadySubscribed"),
            leadId,
            subscriptionId: existingSubscription.id,
            userId: claimed.userId || undefined,
            creditBonus,
            bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
          });
        }

        // Reactivate subscription
        logger.debug("Reactivating newsletter subscription", {
          email: data.email,
          previousStatus: existingSubscription.status,
        });

        await db
          .update(newsletterSubscriptions)
          .set({
            status: NewsletterSubscriptionStatus.SUBSCRIBED,
            marketingConsent: true,
            source: "website",
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscriptions.email, data.email));

        return success({
          success: true,
          message: t("response.success"),
          leadId,
          subscriptionId: existingSubscription.id,
          userId: claimed.userId || undefined,
          creditBonus,
          bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
        });
      }

      // Create new subscription
      logger.debug("Creating new newsletter subscription", {
        email: data.email,
        hasName: !!data.name,
        preferencesCount: data.preferences?.length || 0,
      });

      const newSubscription = await db
        .insert(newsletterSubscriptions)
        .values({
          email: data.email,
          name: data.name,
          status: NewsletterSubscriptionStatus.SUBSCRIBED,
          marketingConsent: true,
          leadId,
          userId: user.isPublic ? null : user.id,
          confirmationToken: NewsletterSubscribeRepository.createToken(),
        })
        .returning();

      logger.debug("Newsletter subscription created successfully", {
        email: data.email,
        subscriptionId: newSubscription[0].id,
      });

      // Send SMS notifications after successful subscription (fire-and-forget)
      const { sendWelcomeSms, sendAdminNotificationSms } =
        await import("./sms");
      sendWelcomeSms(data, user, locale, logger).catch((smsError: Error) =>
        logger.debug("Welcome SMS failed but continuing", { smsError }),
      );
      sendAdminNotificationSms(data, user, locale, logger).catch(
        (smsError: Error) =>
          logger.debug("Admin SMS failed but continuing", { smsError }),
      );

      return success({
        success: true,
        message: t("response.success"),
        leadId,
        subscriptionId: newSubscription[0].id,
        userId: newSubscription[0].userId || undefined,
        // Fresh rows are never confirmed - the welcome email carries the link.
        // Guests get the newsletter but no credits: the bonus is account-only.
        creditBonus: user.isPublic
          ? NewsletterCreditBonus.ACCOUNT_REQUIRED
          : NewsletterCreditBonus.PENDING_CONFIRMATION,
        bonusCredits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Newsletter subscription failed", {
        error: parsedError.message,
        email: data.email,
      });

      return fail({
        message: t("errors.internal.detail", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Random, URL-safe double opt-in token */
  static createToken(): string {
    return randomBytes(24).toString("base64url");
  }

  /**
   * The address to store on the lead, or null when the lead already has one
   * or another lead owns it (leads.email is unique).
   */
  private static async resolveCapturableLeadEmail(
    leadId: string,
    email: string,
  ): Promise<string | null> {
    const [lead] = await db
      .select({ email: leads.email })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    if (!lead || lead.email) {
      return null;
    }
    const [owner] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.email, email), ne(leads.id, leadId)))
      .limit(1);
    return owner ? null : email;
  }

  /**
   * Attach an existing subscription to this visitor when it has no owner yet,
   * and issue a confirmation token while it is unconfirmed.
   * An owned row is never re-assigned: one email -> one bonus.
   */
  private static async claimSubscription(
    subscription: NewsletterSubscriptionRow,
    user: JwtPayloadType,
  ): Promise<NewsletterSubscriptionRow> {
    const updates: Partial<
      Pick<NewsletterSubscriptionRow, "leadId" | "userId" | "confirmationToken">
    > = {};
    if (!subscription.leadId && !subscription.userId) {
      updates.leadId = user.leadId;
    }
    if (!subscription.userId && !user.isPublic) {
      const ownedByThisUser =
        !subscription.leadId ||
        subscription.leadId === user.leadId ||
        (await NewsletterSubscribeRepository.isLeadLinkedToUser(
          subscription.leadId,
          user.id,
        ));
      if (ownedByThisUser) {
        updates.userId = user.id;
      }
    }
    if (!subscription.confirmedAt && !subscription.confirmationToken) {
      updates.confirmationToken = NewsletterSubscribeRepository.createToken();
    }
    if (Object.keys(updates).length === 0) {
      return subscription;
    }
    const [updated] = await db
      .update(newsletterSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(newsletterSubscriptions.id, subscription.id))
      .returning();
    return updated ?? subscription;
  }

  private static async isLeadLinkedToUser(
    leadId: string,
    userId: string,
  ): Promise<boolean> {
    const [link] = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(
        and(eq(userLeadLinks.leadId, leadId), eq(userLeadLinks.userId, userId)),
      )
      .limit(1);
    return link !== undefined;
  }

  /**
   * Where the free-credit bonus stands for this visitor.
   * Account first: guests never earn the bonus (credits/free-allowance.ts).
   */
  private static async getCreditBonus(
    subscription: NewsletterSubscriptionRow,
    user: JwtPayloadType,
  ): Promise<typeof NewsletterCreditBonusValue> {
    if (user.isPublic) {
      return NewsletterCreditBonus.ACCOUNT_REQUIRED;
    }
    const ownedByVisitor =
      subscription.leadId === user.leadId ||
      (!user.isPublic &&
        (subscription.userId === user.id ||
          (subscription.leadId !== null &&
            (await NewsletterSubscribeRepository.isLeadLinkedToUser(
              subscription.leadId,
              user.id,
            )))));
    if (!ownedByVisitor) {
      return NewsletterCreditBonus.CLAIMED_ELSEWHERE;
    }
    return subscription.confirmedAt
      ? NewsletterCreditBonus.ACTIVE
      : NewsletterCreditBonus.PENDING_CONFIRMATION;
  }

  /**
   * Token for the welcome email's confirm link, or null once confirmed.
   * Server-only lookup - the token is never returned by the API.
   */
  static async getPendingConfirmationToken(
    subscriptionId: string,
  ): Promise<string | null> {
    const [row] = await db
      .select({
        token: newsletterSubscriptions.confirmationToken,
        confirmedAt: newsletterSubscriptions.confirmedAt,
      })
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.id, subscriptionId))
      .limit(1);
    if (!row || row.confirmedAt) {
      return null;
    }
    return row.token;
  }
}
