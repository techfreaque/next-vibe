/**
 * Payment Repository
 * Handles payment operations with Stripe integration
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { paymentMethods, paymentTransactions } from "./db";
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
import type {
  PaymentPortalRequestOutput,
  PaymentPortalResponseOutput,
} from "./portal/definition";
import type {
  PaymentRefundRequestOutput,
  PaymentRefundResponseOutput,
} from "./refund/definition";

// Initialize Stripe lazily to avoid loading env at module load time
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    });
  }
  return stripeInstance;
}

export interface PaymentRepository {
  createPaymentSession(
    data: PaymentPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPostResponseOutput>>;

  getPaymentInfo(
    data: PaymentGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentGetResponseOutput>>;

  createInvoice(
    userId: string,
    data: PaymentInvoiceRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentInvoiceResponseOutput>>;

  createCustomerPortal(
    userId: string,
    data: PaymentPortalRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPortalResponseOutput>>;

  createRefund(
    userId: string,
    data: PaymentRefundRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentRefundResponseOutput>>;

  handleWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ received: boolean }>>;
}

export class PaymentRepositoryImpl implements PaymentRepository {
  async createPaymentSession(
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
        return createErrorResponse(
          "app.api.v1.core.payment.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
          {
            error: t("app.api.v1.core.payment.errors.unauthorized.description"),
          },
        );
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
        return createErrorResponse(
          "app.api.v1.core.payment.create.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId: user.id },
        );
      }

      // Create or get Stripe customer
      let stripeCustomerId: string;
      const existingCustomer = await this.findStripeCustomerByUserId(
        user.id,
        logger,
      );

      if (existingCustomer) {
        stripeCustomerId = existingCustomer;
      } else {
        const customerResult = await this.createStripeCustomer(
          userRecord,
          logger,
        );
        if (!customerResult.success) {
          logger.error("payment.create.error.stripeCustomerFailed");
          return createErrorResponse(
            "app.api.v1.core.payment.create.errors.server.title",
            ErrorResponseTypes.INTERNAL_ERROR,
            {
              error: t("app.api.v1.core.payment.errors.customerCreationFailed"),
            },
          );
        }
        stripeCustomerId = customerResult.data;
      }

      // Create Stripe checkout session
      // Map enum translation keys to Stripe API values
      const paymentMethodTypes = (data.paymentMethodTypes?.map((type) => {
        // Extract last part of translation key (e.g., "card" from "app.api.v1.core.payment.enums.paymentMethodType.card")
        const parts = type.split(".");
        const value = parts[parts.length - 1];
        if (!value) {
          return "";
        }
        // Convert camelCase to snake_case for Stripe (applePay -> apple_pay)
        return value.replace(/([A-Z])/g, (match) => `_${match}`).toLowerCase();
      }) || [
        "card",
      ]) as Stripe.Checkout.SessionCreateParams.PaymentMethodType[];

      // Extract mode value from translation key
      const modeParts = data.mode.split(".");
      const modeValue = modeParts[
        modeParts.length - 1
      ] as Stripe.Checkout.SessionCreateParams.Mode;

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

      const session = await getStripe().checkout.sessions.create(sessionConfig);

      // Store transaction in database
      const [transaction] = await db
        .insert(paymentTransactions)
        .values({
          userId: user.id,
          stripeSessionId: session.id,
          amount: "0", // Will be updated via webhook
          currency: "USD", // Will be updated via webhook
          status: PaymentStatus.PENDING,
          provider: PaymentProvider.STRIPE,
          mode: data.mode,
          metadata: null,
        })
        .returning();

      logger.debug("Payment session created successfully", {
        sessionId: session.id,
        transactionId: transaction.id,
        priceId: data.priceId,
        mode: data.mode,
      });

      return createSuccessResponse({
        priceId: data.priceId,
        mode: data.mode,
        sessionUrl: session.url || "",
        sessionId: session.id,
        message: t("app.api.v1.core.payment.success.sessionCreated"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.create.error.failed", {
        error: parsedError.message,
        userId: user.id,
        priceId: data.priceId,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.create.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async getPaymentInfo(
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
        return createErrorResponse(
          "app.api.v1.core.payment.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
          {
            error: t("app.api.v1.core.payment.errors.unauthorized.description"),
          },
        );
      }

      logger.debug("Getting payment information", {
        userId: user.id,
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

      return createSuccessResponse({
        priceId: userTransactions[0]?.stripeSessionId || "",
        mode: userTransactions[0]?.mode || CheckoutMode.PAYMENT,
        sessionUrl: "",
        sessionId: userTransactions[0]?.stripeSessionId || "",
        message: t("app.api.v1.core.payment.success.infoRetrieved"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.get.error.failed", {
        error: parsedError.message,
        userId: user.id,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  private async findStripeCustomerByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      // Look for existing customer ID in payment transactions
      const [transaction] = await db
        .select({ stripeSessionId: paymentTransactions.stripeSessionId })
        .from(paymentTransactions)
        .where(eq(paymentTransactions.userId, userId))
        .limit(1);

      if (transaction?.stripeSessionId) {
        try {
          const session = await getStripe().checkout.sessions.retrieve(
            transaction.stripeSessionId,
          );
          return typeof session.customer === "string" ? session.customer : null;
        } catch {
          return null;
        }
      }

      // Look in payment methods
      const [method] = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, userId))
        .limit(1);

      if (method?.stripePaymentMethodId) {
        try {
          const paymentMethod = await getStripe().paymentMethods.retrieve(
            method.stripePaymentMethodId,
          );
          return typeof paymentMethod.customer === "string"
            ? paymentMethod.customer
            : null;
        } catch {
          return null;
        }
      }

      return null;
    } catch (error) {
      logger.error("Error finding Stripe customer", {
        error: parseError(error),
        userId,
      });
      return null;
    }
  }

  private async createStripeCustomer(
    user: {
      id: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Creating Stripe customer", {
        userId: user.id,
        email: user.email,
      });

      const customer = await getStripe().customers.create({
        email: user.email,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : undefined,
        metadata: {
          userId: user.id,
        },
      });

      logger.debug("Stripe customer created", {
        customerId: customer.id,
        userId: user.id,
      });

      return createSuccessResponse(customer.id);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.stripe.customer.createFailed", {
        error: parsedError.message,
        userId: user.id,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.create.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async createInvoice(
    userId: string,
    data: PaymentInvoiceRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentInvoiceResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Creating invoice", {
        userId,
        amount: data.amount,
        currency: data.currency,
      });

      // Get or create Stripe customer
      const stripeCustomerId = await this.findStripeCustomerByUserId(
        userId,
        logger,
      );
      if (!stripeCustomerId) {
        logger.error("payment.invoice.error.customerNotFound", { userId });
        return createErrorResponse(
          "app.api.v1.core.payment.invoice.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { error: t("app.api.v1.core.payment.errors.customerNotFound") },
        );
      }

      // Create invoice in Stripe
      const invoice = await getStripe().invoices.create({
        customer: stripeCustomerId,
        collection_method: "send_invoice",
        days_until_due: data.dueDate ? 30 : undefined,
        description: data.description,
        metadata: {
          userId,
          ...data.metadata,
        },
      });

      // Add line item
      await getStripe().invoiceItems.create({
        customer: stripeCustomerId,
        invoice: invoice.id,
        amount: Math.round(data.amount * 100),
        currency: data.currency.toLowerCase(),
        description:
          data.description || t("app.api.v1.core.payment.invoice.defaultItem"),
      });

      // Finalize and send invoice
      const finalizedInvoice = await getStripe().invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true,
        },
      );

      logger.debug("Invoice created successfully", {
        invoiceId: finalizedInvoice.id,
        userId,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.payment.invoice.success.created"),
        invoice: {
          id: finalizedInvoice.id,
          userId,
          stripeInvoiceId: finalizedInvoice.id,
          invoiceNumber: finalizedInvoice.number || "N/A",
          amount: data.amount,
          currency: data.currency,
          status:
            finalizedInvoice.status === "open"
              ? "OPEN"
              : finalizedInvoice.status === "paid"
                ? "PAID"
                : finalizedInvoice.status === "void"
                  ? "VOID"
                  : finalizedInvoice.status === "uncollectible"
                    ? "UNCOLLECTIBLE"
                    : "DRAFT",
          invoiceUrl: finalizedInvoice.hosted_invoice_url || "",
          invoicePdf: finalizedInvoice.invoice_pdf || "",
          dueDate: data.dueDate || new Date().toISOString(),
          paidAt: finalizedInvoice.status_transitions?.paid_at
            ? new Date(
                finalizedInvoice.status_transitions.paid_at * 1000,
              ).toISOString()
            : undefined,
          createdAt: new Date(finalizedInvoice.created * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.invoice.error.failed", {
        error: parsedError.message,
        userId,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.invoice.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async createCustomerPortal(
    userId: string,
    data: PaymentPortalRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPortalResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Creating customer portal session", { userId });

      // Get Stripe customer
      const stripeCustomerId = await this.findStripeCustomerByUserId(
        userId,
        logger,
      );
      if (!stripeCustomerId) {
        logger.error("payment.portal.error.customerNotFound", { userId });
        return createErrorResponse(
          "app.api.v1.core.payment.portal.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { error: t("app.api.v1.core.payment.errors.customerNotFound") },
        );
      }

      // Create portal session
      const session = await getStripe().billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: data.returnUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });

      logger.debug("Customer portal session created", {
        sessionId: session.id,
        userId,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.payment.portal.success.created"),
        customerPortalUrl: session.url,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.portal.error.failed", {
        error: parsedError.message,
        userId,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.portal.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async createRefund(
    userId: string,
    data: PaymentRefundRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentRefundResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Creating refund", {
        userId,
        transactionId: data.transactionId,
        amount: data.amount,
      });

      // Get transaction
      const [transaction] = await db
        .select()
        .from(paymentTransactions)
        .where(
          and(
            eq(paymentTransactions.id, data.transactionId),
            eq(paymentTransactions.userId, userId),
          ),
        )
        .limit(1);

      if (!transaction) {
        logger.error("payment.refund.error.transactionNotFound", {
          transactionId: data.transactionId,
          userId,
        });
        return createErrorResponse(
          "app.api.v1.core.payment.refund.post.errors.notFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { transactionId: data.transactionId },
        );
      }

      // Verify payment intent ID exists
      const paymentIntentId =
        transaction.stripePaymentIntentId || transaction.stripeSessionId;
      if (!paymentIntentId) {
        logger.error("payment.refund.error.noPaymentIntent", {
          transactionId: data.transactionId,
        });
        return createErrorResponse(
          "app.api.v1.core.payment.refund.post.errors.server.title",
          ErrorResponseTypes.BAD_REQUEST,
          {
            error: t(
              "app.api.v1.core.payment.refund.post.errors.server.description",
            ),
          },
        );
      }

      // Create refund in Stripe
      const refund = await getStripe().refunds.create({
        payment_intent: paymentIntentId,
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason:
          (data.reason as
            | "duplicate"
            | "fraudulent"
            | "requested_by_customer") || "requested_by_customer",
        metadata: {
          userId,
          transactionId: data.transactionId,
        },
      });

      logger.debug("Refund created successfully", {
        refundId: refund.id,
        transactionId: data.transactionId,
        userId,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.payment.refund.success.created"),
        refund: {
          id: refund.id,
          userId,
          transactionId: data.transactionId,
          stripeRefundId: refund.id,
          amount: (refund.amount || 0) / 100,
          currency: refund.currency.toUpperCase(),
          status: refund.status || "pending",
          reason:
            data.reason ||
            t("app.api.v1.core.payment.refund.reason.requestedByCustomer"),
          createdAt: new Date(refund.created * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.refund.error.failed", {
        error: parsedError.message,
        userId,
        transactionId: data.transactionId,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.refund.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async handleWebhook(
    body: string,
    signature: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ received: boolean }>> {
    try {
      logger.debug("Processing webhook", {
        signature: `${signature.substring(0, 20)}...`,
      });

      // Verify webhook signature
      const event = getStripe().webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );

      logger.debug("Webhook verified", {
        eventType: event.type,
        eventId: event.id,
      });

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(event.data.object, logger);
          break;
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(event.data.object, logger);
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(event.data.object, logger);
          break;
        case "invoice.payment_succeeded":
          await this.handleInvoicePaymentSucceeded(event.data.object, logger);
          break;
        default:
          logger.debug("Unhandled webhook event type", {
            eventType: event.type,
          });
      }

      return createSuccessResponse({ received: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("payment.webhook.error.processingFailed", {
        error: parsedError.message,
      });

      return createErrorResponse(
        "app.api.v1.core.payment.errors.server.title",
        ErrorResponseTypes.BAD_REQUEST,
        { error: parsedError.message },
      );
    }
  }

  private async handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Update transaction status
      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.SUCCEEDED,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.stripeSessionId, paymentIntent.id));

      logger.debug("Payment succeeded processed", {
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      logger.error("Failed to process payment succeeded", {
        error: parseError(error),
      });
    }
  }

  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Update transaction status
      await db
        .update(paymentTransactions)
        .set({
          status: PaymentStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.stripeSessionId, paymentIntent.id));

      logger.debug("Payment failed processed", {
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      logger.error("Failed to process payment failed", {
        error: parseError(error),
      });
    }
  }

  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Invoice payment succeeded", {
        invoiceId: invoice.id,
      });

      // Retrieve the full subscription from Stripe using the invoice's subscription ID
      // Note: invoice.subscription is an expandable field (string | Subscription object)
      const invoiceWithSubscription = invoice as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription;
      };
      const subscriptionId =
        typeof invoiceWithSubscription.subscription === "string"
          ? invoiceWithSubscription.subscription
          : invoiceWithSubscription.subscription?.id;

      if (!subscriptionId) {
        logger.error("No subscription ID found in invoice", {
          invoiceId: invoice.id,
        });
        return;
      }

      const fullSubscription =
        await getStripe().subscriptions.retrieve(subscriptionId);

      const userId = (
        fullSubscription as Stripe.Subscription & {
          metadata?: Record<string, string>;
        }
      ).metadata?.userId;
      if (!userId) {
        logger.error("No userId found in subscription metadata", {
          subscriptionId: fullSubscription.id,
        });
        return;
      }

      // Calculate expiry date (end of current billing period)
      const subscription = fullSubscription as Stripe.Subscription & {
        current_period_end?: number;
      };
      const expiresAt = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined;

      // Import credit repository dynamically to avoid circular dependencies
      const { creditRepository } = await import("../credits/repository");

      // Add 1000 expiring credits for the subscription
      const result = await creditRepository.addUserCredits(
        userId,
        1000,
        "subscription",
        logger,
        expiresAt,
      );

      if (!result.success) {
        logger.error("Failed to add subscription credits", {
          invoiceId: invoice.id,
          userId,
          error: result.message,
        });
        return;
      }

      logger.info("Subscription credits added successfully", {
        invoiceId: invoice.id,
        userId,
        credits: 1000,
        expiresAt: expiresAt?.toISOString(),
      });
    } catch (error) {
      logger.error("Failed to process invoice payment succeeded", {
        error: parseError(error),
        invoiceId: invoice.id,
      });
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Checkout session completed", {
        sessionId: session.id,
        metadata: session.metadata,
      });

      // Check if this is a credit pack purchase
      if (session.metadata?.type === "credit_pack") {
        const userId = session.metadata.userId;
        const totalCredits = parseInt(session.metadata.totalCredits || "0", 10);

        if (!userId || !totalCredits) {
          logger.error("Invalid credit pack metadata", {
            sessionId: session.id,
            metadata: session.metadata,
          });
          return;
        }

        // Import credit repository dynamically to avoid circular dependencies
        const { creditRepository } = await import("../credits/repository");

        // Add permanent credits to user account
        const result = await creditRepository.addUserCredits(
          userId,
          totalCredits,
          "permanent",
          logger,
          undefined, // No expiry for permanent credits
        );

        if (!result.success) {
          logger.error("Failed to add credits after purchase", {
            sessionId: session.id,
            userId,
            totalCredits,
            error: result.message,
          });
          return;
        }

        logger.info("Credits added successfully after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });
      }
    } catch (error) {
      logger.error("Failed to process checkout session completed", {
        error: parseError(error),
        sessionId: session.id,
      });
    }
  }
}

export const paymentRepository = new PaymentRepositoryImpl();
