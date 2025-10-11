/**
 * Payment Repository
 * Handles payment operations with Stripe integration
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";
import Stripe from "stripe";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { env } from "next-vibe/server/env";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { paymentMethods, paymentTransactions } from "./db";
import type {
  PaymentGetRequestTypeOutput,
  PaymentGetResponseTypeOutput,
  PaymentPostRequestTypeOutput,
  PaymentPostResponseTypeOutput,
} from "./definition";
import {
  CheckoutMode,
  PaymentMethodType,
  PaymentProvider,
  PaymentStatus,
} from "./enum";
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
      apiVersion: "2025-07-30.basil",
    });
  }
  return stripeInstance;
}

export interface PaymentRepository {
  createPaymentSession(
    data: PaymentPostRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPostResponseTypeOutput>>;

  getPaymentInfo(
    data: PaymentGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentGetResponseTypeOutput>>;

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
    data: PaymentPostRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentPostResponseTypeOutput>> {
    const { t } = simpleT(locale);

    try {
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
        logger.error("User not found for payment session", { userId: user.id });
        return createErrorResponse(
          t("app.api.v1.core.payment.create.errors.validation.title"),
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
          return createErrorResponse(
            t("app.api.v1.core.payment.create.errors.internal.title"),
            ErrorResponseTypes.INTERNAL_ERROR,
            { error: "Failed to create Stripe customer" },
          );
        }
        stripeCustomerId = customerResult.data;
      }

      // Create Stripe checkout session
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: stripeCustomerId,
        payment_method_types: data.paymentMethodTypes || [
          PaymentMethodType.CARD,
        ],
        mode: data.mode,
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          ...data.metadata,
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
          metadata: data.metadata,
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
        message: t("app.api.v1.core.payment.create.response.message"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create payment session", {
        error: parsedError.message,
        userId: user.id,
        priceId: data.priceId,
      });

      return createErrorResponse(
        t("app.api.v1.core.payment.create.errors.internal.title"),
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  async getPaymentInfo(
    data: PaymentGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PaymentGetResponseTypeOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Getting payment information", {
        userId: user.id,
      });

      // Get user's recent transactions
      const userTransactions = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.userId, user.id))
        .orderBy(paymentTransactions.createdAt)
        .limit(10);

      // Get user's payment methods
      const userPaymentMethods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, user.id))
        .orderBy(paymentMethods.createdAt)
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
        message: t("app.api.v1.core.payment.get.response.message"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get payment information", {
        error: parsedError.message,
        userId: user.id,
      });

      return createErrorResponse(
        t("app.api.v1.core.payment.get.errors.internal.title"),
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
      logger.error("Error finding Stripe customer", { error, userId });
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
      logger.error("Failed to create Stripe customer", {
        error: parsedError.message,
        userId: user.id,
      });

      return createErrorResponse(
        "Failed to create customer",
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
        return createErrorResponse(
          t("app.api.v1.core.payment.invoice.post.errors.validation.title"),
          ErrorResponseTypes.NOT_FOUND,
          { error: "Customer not found" },
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
        description: data.description || "Invoice item",
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
        message: t("app.api.v1.core.payment.invoice.response.message"),
        invoice: {
          id: finalizedInvoice.id,
          userId,
          stripeInvoiceId: finalizedInvoice.id,
          invoiceNumber: finalizedInvoice.number || "N/A",
          amount: data.amount,
          currency: data.currency,
          status: finalizedInvoice.status,
          invoiceUrl: finalizedInvoice.invoice_pdf || "",
          invoicePdf: finalizedInvoice.invoice_pdf || "",
          dueDate: data.dueDate || new Date().toISOString(),
          paidAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create invoice", {
        error: parsedError.message,
        userId,
      });

      return createErrorResponse(
        t("app.api.v1.core.payment.invoice.post.errors.server.title"),
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
        return createErrorResponse(
          t("app.api.v1.core.payment.portal.post.errors.notFound.title"),
          ErrorResponseTypes.NOT_FOUND,
          { error: "Customer not found" },
        );
      }

      // Create portal session
      const session = await getStripe().billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: data.returnUrl,
      });

      logger.debug("Customer portal session created", {
        sessionId: session.id,
        userId,
      });

      return createSuccessResponse({
        success: true,
        message: t("app.api.v1.core.payment.portal.response.message"),
        customerPortalUrl: session.url,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create customer portal session", {
        error: parsedError.message,
        userId,
      });

      return createErrorResponse(
        t("app.api.v1.core.payment.portal.post.errors.server.title"),
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
        return createErrorResponse(
          t("app.api.v1.core.payment.refund.post.errors.notFound.title"),
          ErrorResponseTypes.NOT_FOUND,
          { transactionId: data.transactionId },
        );
      }

      // Create refund in Stripe (assuming payment intent ID stored)
      const refund = await getStripe().refunds.create({
        payment_intent: transaction.stripeSessionId, // This should be payment intent ID
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason: data.reason || "requested_by_customer",
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
        message: t("app.api.v1.core.payment.refund.response.message"),
        refund: {
          id: refund.id,
          transactionId: data.transactionId,
          amount: (refund.amount || 0) / 100,
          currency: refund.currency.toUpperCase(),
          status: refund.status,
          reason: refund.reason || "requested_by_customer",
          createdAt: new Date(refund.created * 1000).toISOString(),
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create refund", {
        error: parsedError.message,
        userId,
        transactionId: data.transactionId,
      });

      return createErrorResponse(
        t("app.api.v1.core.payment.refund.post.errors.server.title"),
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
        env.STRIPE_WEBHOOK_SECRET || "",
      );

      logger.debug("Webhook verified", {
        eventType: event.type,
        eventId: event.id,
      });

      // Handle different event types
      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(event.data.object, logger);
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(event.data.object, logger);
          break;
        case "invoice.payment_succeeded":
          await this.handleInvoicePaymentSucceeded(
            event.data.object,
            logger,
          );
          break;
        default:
          logger.debug("Unhandled webhook event type", {
            eventType: event.type,
          });
      }

      return createSuccessResponse({ received: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Webhook processing failed", {
        error: parsedError.message,
      });

      return createErrorResponse(
        "Webhook processing failed",
        ErrorResponseTypes.BAD_REQUEST,
        { error: parsedError.message },
      );
    }
  }

  private async handlePaymentSucceeded(
    paymentIntent: any,
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
      logger.error("Failed to process payment succeeded", { error });
    }
  }

  private async handlePaymentFailed(
    paymentIntent: any,
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
      logger.error("Failed to process payment failed", { error });
    }
  }

  private async handleInvoicePaymentSucceeded(
    invoice: any,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Invoice payment succeeded", {
        invoiceId: invoice.id,
      });
      // Add invoice payment processing logic here if needed
    } catch (error) {
      logger.error("Failed to process invoice payment succeeded", { error });
    }
  }
}

export const paymentRepository = new PaymentRepositoryImpl();
