/**
 * Stripe Admin Tools
 * Stripe-specific admin operations: invoice, portal, refund
 * Separated from main payment repository for clean provider abstraction
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  fail,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { paymentTransactions } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  PaymentInvoiceRequestOutput,
  PaymentInvoiceResponseOutput,
} from "../../invoice/definition";
import type {
  PaymentPortalRequestOutput,
  PaymentPortalResponseOutput,
} from "../../portal/definition";
import type {
  PaymentRefundRequestOutput,
  PaymentRefundResponseOutput,
} from "../../refund/definition";
import { stripe } from "./repository";

export interface StripeAdminTools {
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
}

export class StripeAdminToolsImpl implements StripeAdminTools {
  private async findStripeCustomerByUserId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user?.stripeCustomerId) {
        logger.debug("No Stripe customer ID found for user", { userId });
        return null;
      }

      return user.stripeCustomerId;
    } catch (error) {
      logger.error("Error finding Stripe customer", {
        error: parseError(error),
        userId,
      });
      return null;
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

      const stripeCustomerId = await this.findStripeCustomerByUserId(
        userId,
        logger,
      );
      if (!stripeCustomerId) {
        logger.error("payment.invoice.error.customerNotFound", { userId });
        return fail({
          message: "app.api.v1.core.payment.invoice.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("app.api.v1.core.payment.errors.customerNotFound"),
          },
        });
      }

      const invoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: "send_invoice",
        days_until_due: data.dueDate ? 30 : undefined,
        description: data.description,
        metadata: {
          userId,
          ...data.metadata,
        },
      });

      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: invoice.id,
        amount: Math.round(data.amount * 100),
        currency: data.currency.toLowerCase(),
        description:
          data.description || t("app.api.v1.core.payment.invoice.defaultItem"),
      });

      const finalizedInvoice = await stripe.invoices.finalizeInvoice(
        invoice.id,
        {
          auto_advance: true,
        },
      );

      logger.debug("Invoice created successfully", {
        invoiceId: finalizedInvoice.id,
        userId,
      });

      return success({
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
              ? InvoiceStatus.OPEN
              : finalizedInvoice.status === "paid"
                ? InvoiceStatus.PAID
                : finalizedInvoice.status === "void"
                  ? InvoiceStatus.VOID
                  : finalizedInvoice.status === "uncollectible"
                    ? InvoiceStatus.UNCOLLECTIBLE
                    : InvoiceStatus.DRAFT,
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

      return fail({
        message: "app.api.v1.core.payment.invoice.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
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

      const stripeCustomerId = await this.findStripeCustomerByUserId(
        userId,
        logger,
      );
      if (!stripeCustomerId) {
        logger.error("payment.portal.error.customerNotFound", { userId });
        return fail({
          message: "app.api.v1.core.payment.portal.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("app.api.v1.core.payment.errors.customerNotFound"),
          },
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: data.returnUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });

      logger.debug("Customer portal session created", {
        sessionId: session.id,
        userId,
      });

      return success({
        success: true,
        message: t("app.api.v1.core.payment.portal.success.created"),
        customerPortalUrl: session.url,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check for Stripe portal configuration error
      if (
        errorMessage.includes("No configuration provided") ||
        errorMessage.includes("default configuration has not been created")
      ) {
        logger.warn("payment.portal.error.notConfigured", {
          errorMessage,
          userId,
        });

        return fail({
          message: "app.api.v1.core.payment.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              "Stripe Customer Portal is not configured. Please configure it in Stripe Dashboard.",
            configUrl:
              "https://dashboard.stripe.com/test/settings/billing/portal",
          },
        });
      }

      logger.error("payment.portal.error.failed", {
        errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined,
        userId,
      });

      return fail({
        message: "app.api.v1.core.payment.portal.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
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
        return fail({
          message: "app.api.v1.core.payment.refund.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { transactionId: data.transactionId },
        });
      }

      const paymentIntentId =
        transaction.providerPaymentIntentId || transaction.providerSessionId;
      if (!paymentIntentId) {
        logger.error("payment.refund.error.noPaymentIntent", {
          transactionId: data.transactionId,
        });
        return fail({
          message: "app.api.v1.core.payment.refund.post.errors.server.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: {
            error: t(
              "app.api.v1.core.payment.refund.post.errors.server.description",
            ),
          },
        });
      }

      const refund = await stripe.refunds.create({
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

      return success({
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

      return fail({
        message: "app.api.v1.core.payment.refund.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

export const stripeAdminTools = new StripeAdminToolsImpl();
