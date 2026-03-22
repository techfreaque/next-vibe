/**
 * Payment Repository
 * Handles webhook routing, transaction management, and Stripe-specific admin tools
 */

import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { subscriptions } from "../subscription/db";
import { paymentMethods, paymentTransactions, paymentWebhooks } from "./db";
import type {
  PaymentGetRequestOutput,
  PaymentGetResponseOutput,
  PaymentPostRequestOutput,
  PaymentPostResponseOutput,
} from "./definition";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "./enum";
import type { PaymentT } from "./i18n";
import { scopedTranslation } from "./i18n";
import type {
  PaymentInvoiceRequestOutput,
  PaymentInvoiceResponseOutput,
} from "./invoice/definition";
import type {
  PaymentPortalRequestOutput,
  PaymentPortalResponseOutput,
} from "./portal/definition";
import { stripeAdminTools } from "./providers/stripe/admin";
import { StripeProvider } from "./providers/stripe/repository";
import type { CreditPackCheckoutSession, WebhookData } from "./providers/types";
import type {
  PaymentRefundRequestOutput,
  PaymentRefundResponseOutput,
} from "./refund/definition";

export class PaymentRepository {
  static async createPaymentSession(
    data: PaymentPostRequestOutput,
    user: JwtPayloadType,
    t: PaymentT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PaymentPostResponseOutput>> {
    if (env.NEXT_PUBLIC_LOCAL_MODE) {
      logger.info("Payment disabled in local mode");
      return fail({
        message: t("errors.localMode"),
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          error: t("errors.unauthorized.description"),
        },
      });
    }

    try {
      // Payment endpoints require authenticated users with ID
      if (user.isPublic) {
        logger.error("payment.create.error.publicUserNotAllowed");
        return fail({
          message: t("errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: {
            error: t("errors.unauthorized.description"),
          },
        });
      }

      logger.debug("Creating payment session", {
        userId: user.id,
        priceId: data.priceId,
        mode: data.mode,
      });

      // Get user information
      const [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!userRecord) {
        logger.error("payment.create.error.userNotFound", { userId: user.id });
        return fail({
          message: t("create.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: user.id },
        });
      }

      // Get or create Stripe customer (handles invalid test IDs)
      const { getPaymentProvider } = await import("./providers/index");
      const paymentProvider = getPaymentProvider(PaymentProvider.STRIPE);

      const customerResult = await paymentProvider.ensureCustomer(
        user.id,
        userRecord.email,
        userRecord.publicName,
        logger,
        locale,
      );

      if (!customerResult.success) {
        return customerResult;
      }

      const stripeCustomerId = customerResult.data.customerId;

      // Create Stripe checkout session
      const stripe = StripeProvider.getStripe();
      if (!stripe) {
        return fail({
          message: t("create.errors.server.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            error:
              "Stripe is not configured — set STRIPE_SECRET_KEY in your .env",
          },
        });
      }
      // Map enum translation keys to Stripe API values
      const paymentMethodTypes = (data.paymentMethodTypes?.map((type) => {
        // Extract last part of translation key (e.g., "card" from "enums.paymentMethodType.card")
        const parts = type.split(".");
        const value = parts.at(-1);
        if (!value) {
          return "";
        }
        // Convert camelCase to snake_case for Stripe (applePay -> apple_pay)
        return value
          .replaceAll(/([A-Z])/g, (match) => `_${match}`)
          .toLowerCase();
      }) || [
        "card",
      ]) as Stripe.Checkout.SessionCreateParams.PaymentMethodType[];

      // Extract mode value from translation key
      const modeParts = data.mode.split(".");
      const modeValue = modeParts.at(
        -1,
      ) as Stripe.Checkout.SessionCreateParams.Mode;

      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: stripeCustomerId,
        payment_method_types: paymentMethodTypes,
        mode: modeValue,
        success_url:
          data.successUrl || `${env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url:
          data.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        customer_update: {
          address: "auto",
        },
      };

      const session = await stripe.checkout.sessions.create(sessionConfig);

      // Store transaction in database
      let transaction;
      try {
        [transaction] = await db
          .insert(paymentTransactions)
          .values({
            userId: user.id,
            providerSessionId: session.id,
            amount: "0", // Will be updated via webhook
            currency: "USD", // Will be updated via webhook
            status: PaymentStatus.PENDING,
            provider: PaymentProvider.STRIPE,
            mode: data.mode,
            metadata: null,
          })
          .returning();
      } catch (dbError) {
        // If DB insert fails, expire the Stripe session
        logger.error("Failed to store transaction, expiring Stripe session", {
          sessionId: session.id,
          error: parseError(dbError),
        });
        await stripe.checkout.sessions.expire(session.id).catch(() => {
          // Ignore expiration errors
        });
        return fail({
          message: t("create.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: parseError(dbError).message },
        });
      }

      logger.debug("Payment session created successfully", {
        sessionId: session.id,
        transactionId: transaction.id,
        priceId: data.priceId,
        mode: data.mode,
      });

      return success({
        priceId: data.priceId,
        mode: data.mode,
        sessionUrl: session.url || "",
        sessionId: session.id,
        message: t("success.sessionCreated"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.create.error.failed", {
        error: parsedError.message,
        userId: user.id,
        priceId: data.priceId,
      });

      return fail({
        message: t("create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async getPaymentInfo(
    data: PaymentGetRequestOutput,
    user: JwtPayloadType,
    t: PaymentT,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentGetResponseOutput>> {
    try {
      // Payment endpoints require authenticated users with ID
      if (user.isPublic) {
        logger.error("payment.get.error.publicUserNotAllowed");
        return fail({
          message: t("errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: {
            error: t("errors.unauthorized.description"),
          },
        });
      }

      logger.debug("Getting payment information", {
        userId: user.id,
        requestData: data,
      });

      // Get user's recent transactions
      const userTransactions = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.userId, user.id))
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(10);

      // Get user's payment methods
      const userPaymentMethods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, user.id))
        .orderBy(desc(paymentMethods.createdAt))
        .limit(10);

      logger.debug("Payment information retrieved", {
        userId: user.id,
        transactionCount: userTransactions.length,
        paymentMethodCount: userPaymentMethods.length,
      });

      return success({
        priceId: userTransactions[0]?.providerSessionId || "",
        mode: userTransactions[0]?.mode || CheckoutMode.PAYMENT,
        sessionUrl: "",
        sessionId: userTransactions[0]?.providerSessionId || "",
        message: t("success.infoRetrieved"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.get.error.failed", {
        error: parsedError.message,
        userId: user.id,
      });

      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async createInvoice(
    userId: string,
    data: PaymentInvoiceRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentInvoiceResponseOutput>> {
    return stripeAdminTools.createInvoice(userId, data, locale, logger);
  }

  static async createCustomerPortal(
    userId: string,
    data: PaymentPortalRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPortalResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    // Get user's subscription to determine provider
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (!subscription[0]) {
      logger.error("No subscription found for user", { userId });
      return fail({
        message: t("errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Route to correct provider
    if (subscription[0].provider === PaymentProvider.NOWPAYMENTS) {
      // For NOWPayments, return info that they manage via email
      return success({
        success: true,
        customerPortalUrl: null,
        message:
          "NOWPayments subscriptions are managed via email. Please check your inbox for payment links and subscription details.",
      });
    }

    // Default to Stripe portal
    return stripeAdminTools.createCustomerPortal(userId, data, locale, logger);
  }

  static async createRefund(
    userId: string,
    data: PaymentRefundRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentRefundResponseOutput>> {
    return stripeAdminTools.createRefund(userId, data, locale, logger);
  }

  static async handleWebhook(
    body: string,
    signature: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    provider:
      | typeof PaymentProvider.STRIPE
      | typeof PaymentProvider.NOWPAYMENTS = PaymentProvider.STRIPE,
  ): Promise<ResponseType<{ received: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Processing webhook", {
        signature: `${signature.slice(0, 20)}...`,
        provider,
      });

      // Import the appropriate payment provider
      const { getPaymentProvider } = await import("./providers/index");
      const paymentProvider = getPaymentProvider(provider);

      // Verify webhook signature using provider
      const verificationResult = await paymentProvider.verifyWebhook(
        body,
        signature,
        logger,
        locale,
      );

      if (!verificationResult.success) {
        logger.error("Webhook verification failed", {
          provider,
          error: verificationResult.message,
        });
        return fail({
          message: t("errors.webhookVerificationFailed"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: verificationResult.message },
        });
      }

      const event = verificationResult.data;

      logger.debug("Webhook verified", {
        eventType: event.type,
        eventId: event.id,
        provider,
      });

      // Atomic idempotency: insert-or-update in one operation.
      // - New event: inserts with processed=false, returns row → process it.
      // - Already processed (processed=true): conflict, WHERE excludes it → no row → skip.
      // - Previously failed (processed=false): conflict, WHERE matches → updates data, returns row → retry.
      // This allows Stripe retriggers to reprocess webhooks that failed on previous attempts.
      const [webhookRow] = await db
        .insert(paymentWebhooks)
        .values({
          providerEventId: event.id,
          eventType: event.type,
          processed: false,
          data: body,
        })
        .onConflictDoUpdate({
          target: paymentWebhooks.providerEventId,
          set: { data: body },
          where: eq(paymentWebhooks.processed, false),
        })
        .returning({ id: paymentWebhooks.id });

      if (!webhookRow) {
        // Either already processed or being processed by another request
        logger.debug("Webhook already recorded, skipping", {
          eventId: event.id,
        });
        return success({ received: true });
      }

      // Handle different event types
      // Provider already extracted the data object (e.g., Stripe's event.data.object)
      const eventData = event.data;

      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(eventData, logger);
          break;
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(eventData, logger);
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(eventData, logger);
          break;
        case "invoice.created":
          await this.handleInvoiceCreated(eventData, logger, locale);
          break;
        case "invoice.payment_succeeded":
        case "invoice.paid":
          await this.handleInvoicePaymentSucceeded(eventData, logger, locale);
          break;
        case "invoice.payment_failed":
          await this.handleInvoicePaymentFailed(eventData, logger, locale);
          break;
        case "invoice.voided":
          await this.handleInvoiceVoided(eventData, logger, locale);
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(eventData, logger, locale);
          break;
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdated(eventData, logger, locale);
          break;
        case "checkout.session.expired":
          await this.handleCheckoutSessionExpired(eventData, logger);
          break;
        default:
          logger.debug("Unhandled webhook event type", {
            eventType: event.type,
          });
      }

      // Mark webhook as processed
      await db
        .update(paymentWebhooks)
        .set({ processed: true, processedAt: new Date() })
        .where(eq(paymentWebhooks.providerEventId, event.id));

      return success({ received: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.webhook.error.processingFailed", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
        messageParams: { error: parsedError.message },
      });
    }
  }

  private static async handlePaymentSucceeded(
    data: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const paymentIntentId = data.id;

      // Update transaction status
      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.SUCCEEDED,
          updatedAt: new Date(),
        })
        .where(
          eq(paymentTransactions.providerPaymentIntentId, paymentIntentId),
        );

      logger.debug("Payment succeeded processed", {
        paymentIntentId,
      });
    } catch (error) {
      logger.error("Failed to process payment succeeded", {
        error: parseError(error),
      });
    }
  }

  private static async handlePaymentFailed(
    data: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const paymentIntentId = data.id;

      // Update transaction status
      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(
          eq(paymentTransactions.providerPaymentIntentId, paymentIntentId),
        );

      logger.debug("Payment failed processed", {
        paymentIntentId,
      });
    } catch (error) {
      logger.error("Failed to process payment failed", {
        error: parseError(error),
      });
    }
  }

  /**
   * Extract subscription ID from invoice webhook data.
   * Handles both direct `subscription` field and `parent.subscription_details` (Stripe API 2025-03-31+).
   */
  private static extractSubscriptionIdFromInvoice(
    data: WebhookData,
    logger: EndpointLogger,
  ): string | undefined {
    const invoiceId = data.id;

    // Try direct subscription field first
    if ("subscription" in data && data.subscription) {
      logger.info("Found subscription ID at root level", {
        invoiceId,
        subscriptionId: data.subscription,
      });
      return data.subscription;
    }

    // Try parent.subscription_details (Stripe API 2025-03-31+)
    if ("parent" in data && data.parent && typeof data.parent === "object") {
      logger.info("Parent object found in invoice", {
        invoiceId,
        parentKeys: Object.keys(data.parent),
      });

      if (
        "subscription_details" in data.parent &&
        data.parent.subscription_details &&
        typeof data.parent.subscription_details === "object"
      ) {
        const subDetails = data.parent.subscription_details;
        if (
          typeof subDetails === "object" &&
          subDetails !== null &&
          "subscription" in subDetails &&
          typeof subDetails.subscription === "string" &&
          subDetails.subscription.length > 0
        ) {
          logger.info("Found subscription ID in parent.subscription_details", {
            invoiceId,
            subscriptionId: subDetails.subscription,
          });
          return subDetails.subscription;
        }
      }
    }

    logger.warn(
      "No subscription ID found in invoice - skipping subscription processing",
      {
        invoiceId,
        dataKeys: Object.keys(data),
      },
    );
    return undefined;
  }

  /**
   * Handle invoice.created — pre-grant credits before payment confirmation.
   * This ensures users have credits immediately when a new billing period starts,
   * even if payment takes time or fails temporarily.
   */
  private static async handleInvoiceCreated(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = data.id;
      const billingReason = data.billing_reason;

      logger.info("Invoice created - checking for credit pre-grant", {
        invoiceId,
        billingReason,
        hasRootSubscription: "subscription" in data,
        hasParent: "parent" in data,
      });

      const subscriptionId = this.extractSubscriptionIdFromInvoice(
        data,
        logger,
      );

      if (!subscriptionId) {
        return;
      }

      // Subscription module handles pre-granting logic
      const { SubscriptionRepository } =
        await import("../subscription/repository");
      await SubscriptionRepository.handleInvoiceCreated(
        data,
        subscriptionId,
        logger,
        locale,
      );
    } catch (error) {
      logger.error("Failed to process invoice created", {
        error: parseError(error),
        invoiceId: data.id,
      });
    }
  }

  private static async handleInvoicePaymentSucceeded(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = data.id;

      logger.info("Invoice payment succeeded - extracting subscription ID", {
        invoiceId,
        hasRootSubscription: "subscription" in data,
        hasParent: "parent" in data,
      });

      const subscriptionId = this.extractSubscriptionIdFromInvoice(
        data,
        logger,
      );

      if (!subscriptionId) {
        return;
      }

      // Subscription module handles its own business logic
      const { SubscriptionRepository } =
        await import("../subscription/repository");
      await SubscriptionRepository.handleInvoicePaymentSucceeded(
        data,
        subscriptionId,
        logger,
        locale,
      );
    } catch (error) {
      if (typeof error === "object" && error && "id" in error) {
        logger.error("Failed to process invoice payment succeeded", {
          error: parseError(error),
          invoiceId: String(error.id),
        });
      } else {
        logger.error("Failed to process invoice payment succeeded", {
          error: parseError(error),
        });
      }
    }
  }

  private static async handleInvoicePaymentFailed(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = data.id;

      logger.info("Invoice payment failed - extracting subscription ID", {
        invoiceId,
        hasRootSubscription: "subscription" in data,
        hasParent: "parent" in data,
      });

      const subscriptionId = this.extractSubscriptionIdFromInvoice(
        data,
        logger,
      );

      if (!subscriptionId) {
        return;
      }

      // Subscription module handles its own business logic
      const { SubscriptionRepository } =
        await import("../subscription/repository");
      await SubscriptionRepository.handleInvoicePaymentFailed(
        data,
        subscriptionId,
        logger,
        locale,
      );
    } catch (error) {
      logger.error("Failed to process invoice payment failed", {
        error: parseError(error),
        invoiceId: data.id,
      });
    }
  }

  /**
   * Handle invoice.voided — revoke pre-granted credits if invoice is voided.
   * This can happen if Stripe voids an invoice (e.g., subscription changed before payment).
   */
  private static async handleInvoiceVoided(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const invoiceId = data.id;

      logger.info(
        "Invoice voided - checking for pre-granted credits to revoke",
        {
          invoiceId,
        },
      );

      const subscriptionId = this.extractSubscriptionIdFromInvoice(
        data,
        logger,
      );

      if (!subscriptionId) {
        return;
      }

      // Look up any credit pack that was pre-granted for this invoice's period
      // The renewalSessionKey is based on subscription ID + period end
      const { getPaymentProvider } = await import("./providers");

      const provider = getPaymentProvider(PaymentProvider.STRIPE);
      const subResult = await provider.retrieveSubscription(
        subscriptionId,
        logger,
        locale,
      );

      if (!subResult.success || !subResult.data.currentPeriodEnd) {
        logger.warn("Could not retrieve subscription for voided invoice", {
          invoiceId,
          subscriptionId,
        });
        return;
      }

      // Find and revoke the pre-granted credit pack
      const {
        creditPacks,
        creditWallets,
        creditTransactions: creditTxTable,
      } = await import("../credits/db");
      const { CreditTransactionType } = await import("../credits/enum");
      const { withTransaction } =
        await import("../system/db/utils/repository-helpers");

      const periodEndMs = subResult.data.currentPeriodEnd;
      const renewalKey = `renewal_${subscriptionId}_${periodEndMs}`;

      const [packToRevoke] = await db
        .select()
        .from(creditPacks)
        .where(sql`${creditPacks.metadata}->>'sessionId' = ${renewalKey}`)
        .limit(1);

      if (!packToRevoke || packToRevoke.remaining <= 0) {
        logger.info("No pre-granted credits to revoke for voided invoice", {
          invoiceId,
          renewalKey,
        });
        return;
      }

      await withTransaction(logger, async (tx) => {
        const [lockedPack] = await tx
          .select()
          .from(creditPacks)
          .where(eq(creditPacks.id, packToRevoke.id))
          .for("update")
          .limit(1);

        if (!lockedPack || lockedPack.remaining <= 0) {
          return;
        }

        const [wallet] = await tx
          .select()
          .from(creditWallets)
          .where(eq(creditWallets.id, lockedPack.walletId))
          .for("update")
          .limit(1);

        if (wallet) {
          await tx
            .update(creditWallets)
            .set({
              balance: sql`GREATEST(0, ${creditWallets.balance} - ${lockedPack.remaining})`,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, wallet.id));

          const [updated] = await tx
            .select({ balance: creditWallets.balance })
            .from(creditWallets)
            .where(eq(creditWallets.id, wallet.id));

          await tx.insert(creditTxTable).values({
            walletId: wallet.id,
            amount: -lockedPack.remaining,
            balanceAfter: updated?.balance ?? 0,
            type: CreditTransactionType.EXPIRY,
            packId: lockedPack.id,
            freePeriodId: wallet.freePeriodId,
            metadata: {
              expiredPackId: lockedPack.id,
              expiredAmount: lockedPack.remaining,
              originalAmount: lockedPack.originalAmount,
              packType: "subscription",
              expiredAt: new Date().toISOString(),
            },
          });
        }

        await tx.delete(creditPacks).where(eq(creditPacks.id, lockedPack.id));
      });

      logger.info("Revoked pre-granted credits for voided invoice", {
        invoiceId,
        subscriptionId,
        creditsRevoked: packToRevoke.remaining,
      });
    } catch (error) {
      logger.error("Failed to process voided invoice", {
        error: parseError(error),
        invoiceId: data.id,
      });
    }
  }

  /**
   * Handle checkout.session.expired — clean up PENDING transactions.
   */
  private static async handleCheckoutSessionExpired(
    data: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const sessionId = data.id;

      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.providerSessionId, sessionId));

      logger.info("Checkout session expired - marked transaction as failed", {
        sessionId,
      });
    } catch (error) {
      logger.error("Failed to process expired checkout session", {
        error: parseError(error),
        sessionId: data.id,
      });
    }
  }

  private static async handleCheckoutSessionCompleted(
    data: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const sessionId = data.id;
      const metadata =
        "metadata" in data && data.metadata && typeof data.metadata === "object"
          ? data.metadata
          : undefined;
      const type =
        metadata && typeof metadata === "object" && "type" in metadata
          ? String(metadata.type)
          : undefined;

      logger.debug(
        "Checkout session completed - routing to appropriate module",
        {
          sessionId,
          type,
        },
      );

      // Find transaction by session ID first — it holds the authoritative userId
      const [transaction] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.providerSessionId, sessionId))
        .limit(1);

      if (!transaction) {
        logger.warn("No transaction found for checkout session", {
          sessionId,
        });
        return;
      }

      // Look up user's locale from DB — the transaction userId is the source of truth
      const [userRecord] = await db
        .select({ locale: users.locale })
        .from(users)
        .where(eq(users.id, transaction.userId))
        .limit(1);

      if (!userRecord) {
        logger.warn(
          "User not found for transaction — cannot process checkout",
          {
            sessionId,
            userId: transaction.userId,
          },
        );
        return;
      }

      const userLocale = userRecord.locale;
      const { t: creditsT } = creditsScopedTranslation.scopedT(userLocale);

      // Route to appropriate module based on purchase type
      if (type === "credit_pack") {
        const { CreditRepository } = await import("../credits/repository");
        // Convert to provider-agnostic format
        const creditPackSession: CreditPackCheckoutSession = {
          id: sessionId,
          metadata:
            metadata && typeof metadata === "object"
              ? Object.fromEntries(
                  Object.entries(metadata).map(([k, v]) => [k, String(v)]),
                )
              : undefined,
        };
        await CreditRepository.handleCreditPackPurchase(
          creditPackSession,
          logger,
          creditsT,
        );
      } else if (type === "subscription") {
        const { SubscriptionRepository } =
          await import("../subscription/repository");
        await SubscriptionRepository.handleSubscriptionCheckout(
          data,
          logger,
          userLocale,
        );
      } else {
        logger.debug("Unhandled checkout session type", {
          sessionId,
          type,
        });
      }

      // Update transaction status to SUCCEEDED
      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.SUCCEEDED,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.id, transaction.id));

      logger.debug("Transaction status updated to succeeded", {
        transactionId: transaction.id,
        sessionId,
      });

      // Apply referral payout using credits (currency-independent)
      // Credits are determined from product type, not payment amount
      const { productsRepository, ProductIds } =
        await import("../products/repository-client");

      let creditsAmount = 0;
      if (type === "subscription") {
        const subscriptionProduct = productsRepository.getProduct(
          ProductIds.SUBSCRIPTION,
          userLocale,
        );
        creditsAmount = subscriptionProduct.credits; // 800
      } else if (type === "credit_pack") {
        // Credit pack: quantity * credits per pack
        const quantity =
          metadata && typeof metadata === "object" && "quantity" in metadata
            ? Number(metadata.quantity) || 1
            : 1;
        const creditPackProduct = productsRepository.getProduct(
          ProductIds.CREDIT_PACK,
          userLocale,
        );
        creditsAmount = quantity * creditPackProduct.credits; // quantity * 500
      }

      if (creditsAmount > 0) {
        const { ReferralRepository } = await import("../referral/repository");
        await ReferralRepository.applyReferralPayoutOnPayment(
          transaction.id,
          transaction.userId,
          creditsAmount,
          logger,
          creditsT,
          userLocale,
        );
      }
    } catch (error) {
      if (typeof error === "object" && error && "id" in error) {
        logger.error("Failed to process checkout session completed", {
          error: parseError(error),
          sessionId: String(error.id),
        });
      } else {
        logger.error("Failed to process checkout session completed", {
          error: parseError(error),
        });
      }
    }
  }

  private static async handleSubscriptionDeleted(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      const subscriptionId = data.id;

      logger.debug("Subscription deleted - delegating to subscription module", {
        subscriptionId,
      });

      const { SubscriptionRepository } =
        await import("../subscription/repository");
      await SubscriptionRepository.handleSubscriptionCanceled(
        subscriptionId,
        logger,
        locale,
      );
    } catch (error) {
      if (typeof error === "object" && error && "id" in error) {
        logger.error("Failed to process subscription deleted", {
          error: parseError(error),
          subscriptionId: String(error.id),
        });
      } else {
        logger.error("Failed to process subscription deleted", {
          error: parseError(error),
        });
      }
    }
  }

  private static async handleSubscriptionUpdated(
    data: WebhookData,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    try {
      logger.debug("Subscription updated - delegating to subscription module", {
        subscriptionId: data.id,
      });

      const { SubscriptionRepository } =
        await import("../subscription/repository");
      await SubscriptionRepository.handleSubscriptionUpdated(
        data.id,
        logger,
        locale,
      );
    } catch (error) {
      if (typeof error === "object" && error && "id" in error) {
        logger.error("Failed to process subscription updated", {
          error: parseError(error),
          subscriptionId: String(error.id),
        });
      } else {
        logger.error("Failed to process subscription updated", {
          error: parseError(error),
        });
      }
    }
  }
}
