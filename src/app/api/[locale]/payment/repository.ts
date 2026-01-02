/**
 * Payment Repository
 * Handles webhook routing, transaction management, and Stripe-specific admin tools
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type Stripe from "stripe";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { subscriptions } from "../subscription/db";
import { paymentMethods, paymentTransactions, paymentWebhooks } from "./db";
import type {
  PaymentGetRequestOutput,
  PaymentGetResponseOutput,
  PaymentPostRequestOutput,
  PaymentPostResponseOutput,
} from "./definition";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "./enum";
import type {
  PaymentInvoiceRequestOutput,
  PaymentInvoiceResponseOutput,
} from "./invoice/definition";
import type { PaymentPortalRequestOutput, PaymentPortalResponseOutput } from "./portal/definition";
import { stripeAdminTools } from "./providers/stripe/admin";
import { stripe as getStripe } from "./providers/stripe/repository";
import type { CreditPackCheckoutSession, WebhookData } from "./providers/types";
import type { PaymentRefundRequestOutput, PaymentRefundResponseOutput } from "./refund/definition";

export class PaymentRepository {
  static async createPaymentSession(
    data: PaymentPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      // Payment endpoints require authenticated users with ID
      if (user.isPublic) {
        logger.error("payment.create.error.publicUserNotAllowed");
        return fail({
          message: "app.api.payment.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: {
            error: t("app.api.payment.errors.unauthorized.description"),
          },
        });
      }

      logger.debug("Creating payment session", {
        userId: user.id,
        priceId: data.priceId,
        mode: data.mode,
      });

      // Get user information
      const [userRecord] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

      if (!userRecord) {
        logger.error("payment.create.error.userNotFound", { userId: user.id });
        return fail({
          message: "app.api.payment.create.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId: user.id },
        });
      }

      // Get or create Stripe customer (handles invalid test IDs)
      const { getPaymentProvider } = await import("./providers/index");
      const paymentProvider = getPaymentProvider("stripe");

      const customerResult = await paymentProvider.ensureCustomer(
        user.id,
        userRecord.email,
        userRecord.publicName,
        logger,
      );

      if (!customerResult.success) {
        return customerResult;
      }

      const stripeCustomerId = customerResult.data.customerId;

      // Create Stripe checkout session
      // Map enum translation keys to Stripe API values
      const paymentMethodTypes = (data.paymentMethodTypes?.map((type) => {
        // Extract last part of translation key (e.g., "card" from "app.api.payment.enums.paymentMethodType.card")
        const parts = type.split(".");
        const value = parts.at(-1);
        if (!value) {
          return "";
        }
        // Convert camelCase to snake_case for Stripe (applePay -> apple_pay)
        return value.replaceAll(/([A-Z])/g, (match) => `_${match}`).toLowerCase();
      }) || ["card"]) as Stripe.Checkout.SessionCreateParams.PaymentMethodType[];

      // Extract mode value from translation key
      const modeParts = data.mode.split(".");
      const modeValue = modeParts.at(-1) as Stripe.Checkout.SessionCreateParams.Mode;

      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: stripeCustomerId,
        payment_method_types: paymentMethodTypes,
        mode: modeValue,
        success_url: data.successUrl || `${env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: data.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
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

      const session = await getStripe.checkout.sessions.create(sessionConfig);

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
        await getStripe.checkout.sessions.expire(session.id).catch(() => {
          // Ignore expiration errors
        });
        // eslint-disable-next-line @typescript-eslint/only-throw-error, oxlint-plugin-restricted/restricted-syntax
        throw dbError;
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
        message: t("app.api.payment.success.sessionCreated"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.create.error.failed", {
        error: parsedError.message,
        userId: user.id,
        priceId: data.priceId,
      });

      return fail({
        message: "app.api.payment.create.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  static async getPaymentInfo(
    data: PaymentGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentGetResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      // Payment endpoints require authenticated users with ID
      if (user.isPublic) {
        logger.error("payment.get.error.publicUserNotAllowed");
        return fail({
          message: "app.api.payment.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: {
            error: t("app.api.payment.errors.unauthorized.description"),
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
        message: t("app.api.payment.success.infoRetrieved"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.get.error.failed", {
        error: parsedError.message,
        userId: user.id,
      });

      return fail({
        message: "app.api.payment.get.errors.server.title",
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
        message: "app.api.payment.errors.notFound.title",
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
    logger: EndpointLogger,
    provider: "stripe" | "nowpayments" = "stripe",
  ): Promise<ResponseType<{ received: boolean }>> {
    try {
      logger.debug("Processing webhook", {
        signature: `${signature.slice(0, 20)}...`,
        provider,
      });

      // Import the appropriate payment provider
      const { getPaymentProvider } = await import("./providers/index");
      const paymentProvider = getPaymentProvider(provider);

      // Verify webhook signature using provider
      const verificationResult = await paymentProvider.verifyWebhook(body, signature, logger);

      if (!verificationResult.success) {
        logger.error("Webhook verification failed", {
          provider,
          error: verificationResult.message,
        });
        return fail({
          message: "app.api.stripe.errors.webhookVerificationFailed.title",
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

      // Check idempotency - skip if already processed
      const [existing] = await db
        .select()
        .from(paymentWebhooks)
        .where(eq(paymentWebhooks.providerEventId, event.id))
        .limit(1);

      if (existing?.processed) {
        logger.debug("Webhook already processed, skipping", {
          eventId: event.id,
        });
        return success({ received: true });
      }

      // Record webhook event
      await db
        .insert(paymentWebhooks)
        .values({
          providerEventId: event.id,
          eventType: event.type,
          processed: false,
          data: body,
        })
        .onConflictDoNothing();

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
        case "invoice.payment_succeeded":
        case "invoice.paid":
          await this.handleInvoicePaymentSucceeded(eventData, logger);
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(eventData, logger);
          break;
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdated(eventData, logger);
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
        message: "app.api.payment.errors.server.title",
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
        .where(eq(paymentTransactions.providerPaymentIntentId, paymentIntentId));

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
        .where(eq(paymentTransactions.providerPaymentIntentId, paymentIntentId));

      logger.debug("Payment failed processed", {
        paymentIntentId,
      });
    } catch (error) {
      logger.error("Failed to process payment failed", {
        error: parseError(error),
      });
    }
  }

  private static async handleInvoicePaymentSucceeded(
    data: WebhookData,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const invoiceId = data.id;

      logger.debug("Invoice payment succeeded - delegating to subscription module", {
        invoiceId,
      });

      // Try to get subscription ID from various possible fields
      let subscriptionId: string | undefined;

      if ("subscription" in data && data.subscription) {
        subscriptionId = data.subscription;
      }

      if (!subscriptionId && "parent" in data && data.parent && typeof data.parent === "object") {
        if (
          "subscription_details" in data.parent &&
          data.parent.subscription_details &&
          typeof data.parent.subscription_details === "object"
        ) {
          if ("subscription" in data.parent.subscription_details) {
            subscriptionId = String(data.parent.subscription_details.subscription);
          }
        }
      }

      if (!subscriptionId) {
        logger.debug("No subscription ID found in invoice - skipping subscription processing", {
          invoiceId,
        });
        return;
      }

      // Subscription module handles its own business logic
      const { SubscriptionRepository } = await import("../subscription/repository");
      await SubscriptionRepository.handleInvoicePaymentSucceeded(data, subscriptionId, logger);
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

      logger.debug("Checkout session completed - routing to appropriate module", {
        sessionId,
        type,
      });

      // Route to appropriate module based on purchase type
      if (type === "credit_pack") {
        const { CreditRepository } = await import("../credits/repository");
        // Convert to provider-agnostic format
        const creditPackSession: CreditPackCheckoutSession = {
          id: sessionId,
          metadata:
            metadata && typeof metadata === "object"
              ? Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, String(v)]))
              : undefined,
        };
        await CreditRepository.handleCreditPackPurchase(creditPackSession, logger);
      } else if (type === "subscription") {
        const { SubscriptionRepository } = await import("../subscription/repository");
        await SubscriptionRepository.handleSubscriptionCheckout(data, logger);
      } else {
        logger.debug("Unhandled checkout session type", {
          sessionId,
          type,
        });
      }

      // Find transaction by session ID and process referral payout
      // This is provider-agnostic - uses transaction data, not raw webhook data
      const [transaction] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.providerSessionId, sessionId))
        .limit(1);

      if (transaction) {
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
        const { productsRepository, ProductIds } = await import("../products/repository-client");

        let creditsAmount = 0;
        if (type === "subscription") {
          // Subscription: fixed credits from product definition
          // Use "en-US" as default locale since we only need the credits value
          const subscriptionProduct = productsRepository.getProduct(
            ProductIds.SUBSCRIPTION,
            "en-US",
          );
          creditsAmount = subscriptionProduct.credits; // 800
        } else if (type === "credit_pack") {
          // Credit pack: quantity * credits per pack
          const quantity =
            metadata && typeof metadata === "object" && "quantity" in metadata
              ? Number(metadata.quantity) || 1
              : 1;
          const creditPackProduct = productsRepository.getProduct(ProductIds.CREDIT_PACK, "en-US");
          creditsAmount = quantity * creditPackProduct.credits; // quantity * 500
        }

        if (creditsAmount > 0) {
          const { ReferralRepository } = await import("../referral/repository");
          await ReferralRepository.applyReferralPayoutOnPayment(
            transaction.id,
            transaction.userId,
            creditsAmount,
            logger,
          );
        }
      } else {
        logger.warn("No transaction found for checkout session", {
          sessionId,
        });
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
  ): Promise<void> {
    try {
      const subscriptionId = data.id;

      logger.debug("Subscription deleted - delegating to subscription module", {
        subscriptionId,
      });

      const { SubscriptionRepository } = await import("../subscription/repository");
      await SubscriptionRepository.handleSubscriptionCanceled(subscriptionId, logger);
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
  ): Promise<void> {
    try {
      logger.debug("Subscription updated - delegating to subscription module", {
        subscriptionId: data.id,
      });

      const { SubscriptionRepository } = await import("../subscription/repository");
      // The webhook data is actually a Stripe.Subscription object from the event
      await SubscriptionRepository.handleSubscriptionUpdated(data as Stripe.Subscription, logger);
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
