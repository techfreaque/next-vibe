/**
 * Per-company Stripe Checkout payment links & webhook settlement for ERP invoices.
 *
 * - Checkout sessions bind explicitly to the issuing company (company_payment_settings)
 * - Compares current open balance before presenting or replacing a session
 * - Webhook settlement runs BEFORE generic product/credit flows to prevent double revenue
 * - Serializes checkout and settlement with lockLedgerCompany + invoice row lock
 */

import "server-only";

import { createHash } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import type Stripe from "stripe";
import { z } from "zod";

import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import {
  companyPaymentSettings,
  paymentInvoiceReceipts,
  paymentInvoices,
} from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { scopedTranslation } from "@/payment/invoice/recurring/i18n";
import { buildInvoiceViewUrl } from "@/payment/invoice/token";
import { StripeProvider } from "@/payment/providers/stripe/repository";
import type { WebhookData } from "@/payment/providers/types";

export const ERP_INVOICE_CHECKOUT_TYPE = "erp_invoice";

const stripeCheckoutMetaSchema = z.object({
  sessionId: z.string(),
  url: z.string(),
  expectedCents: z.number().int().positive(),
  currency: z.string(),
  createdAt: z.string(),
});

const invoiceMetaStripeSchema = z
  .object({
    stripeCheckout: stripeCheckoutMetaSchema.optional(),
    customerEmail: z.email().optional(),
  })
  .loose();

export interface PreparedStripeCheckout {
  invoiceId: string;
  sessionId: string;
  paymentUrl: string;
  amountCents: number;
  currency: string;
  reused: boolean;
}

export interface StripeInvoiceSettlementResult {
  handled: boolean;
  settled: boolean;
  conflict: boolean;
  invoiceId?: string;
  journalEntryId?: string | null;
}

export function isErpInvoiceWebhook(eventData: WebhookData): boolean {
  return eventData.metadata?.type === ERP_INVOICE_CHECKOUT_TYPE;
}

export type StripeCheckoutSessionCreateParams = NonNullable<
  Parameters<Stripe["checkout"]["sessions"]["create"]>[0]
>;

export interface StripeCheckoutClient {
  checkout: {
    sessions: {
      create(
        params: StripeCheckoutSessionCreateParams,
      ): Promise<{ id: string; url: string | null }>;
    };
  };
}

export async function prepareInvoiceStripeCheckout(
  invoiceId: string,
  logger: EndpointLogger,
  locale: CountryLanguage = defaultLocale,
  stripeClientOverride?: StripeCheckoutClient,
): Promise<ResponseType<PreparedStripeCheckout>> {
  const { t } = scopedTranslation.scopedT(locale);
  try {
    const [observed] = await db
      .select({
        id: paymentInvoices.id,
        companyId: paymentInvoices.companyId,
        status: paymentInvoices.status,
      })
      .from(paymentInvoices)
      .where(eq(paymentInvoices.id, invoiceId))
      .limit(1);

    if (!observed || !observed.companyId) {
      return fail({
        message: t("errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const companyId = observed.companyId;

    const prepared = await db.transaction(async (tx) => {
      await lockLedgerCompany(tx, companyId);

      const [settings] = await tx
        .select()
        .from(companyPaymentSettings)
        .where(eq(companyPaymentSettings.companyId, companyId))
        .limit(1);
      if (!settings?.stripeEnabled) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [invoice] = await tx
        .select()
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.id, invoiceId),
            eq(paymentInvoices.companyId, companyId),
          ),
        )
        .limit(1)
        .for("update");
      if (!invoice || invoice.status !== InvoiceStatus.OPEN) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const balanceParts = getInvoiceOpenBalanceParts(
        tx,
        companyId,
        invoice.currency,
      );
      const [bal] = await tx
        .select({ openAmount: balanceParts.openAmount })
        .from(paymentInvoices)
        .leftJoin(balanceParts.payments, balanceParts.paymentJoin)
        .leftJoin(balanceParts.credits, balanceParts.creditJoin)
        .where(eq(paymentInvoices.id, invoice.id))
        .limit(1);
      const openCents = Math.round(
        Number(bal?.openAmount ?? invoice.amount) * 100,
      );
      if (openCents <= 0) {
        return fail({
          message: t("errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const parsedMeta = invoiceMetaStripeSchema.safeParse(
        invoice.metadata ?? {},
      );
      const existingCheckout = parsedMeta.success
        ? parsedMeta.data.stripeCheckout
        : undefined;
      if (
        existingCheckout &&
        existingCheckout.expectedCents === openCents &&
        existingCheckout.currency.toUpperCase() ===
          invoice.currency.toUpperCase() &&
        existingCheckout.url
      ) {
        return success({
          reused: true as const,
          result: {
            invoiceId: invoice.id,
            sessionId: existingCheckout.sessionId,
            paymentUrl: existingCheckout.url,
            amountCents: openCents,
            currency: invoice.currency,
            reused: true,
          },
        });
      }

      return success({
        reused: false as const,
        invoice,
        openCents,
        customerEmail: parsedMeta.success
          ? parsedMeta.data.customerEmail
          : undefined,
      });
    });

    if (!prepared.success) {
      return prepared;
    }
    if (prepared.data.reused) {
      return success(prepared.data.result);
    }

    const { invoice, openCents, customerEmail } = prepared.data;
    const stripe = stripeClientOverride ?? StripeProvider.getStripe();
    if (!stripe) {
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const invoiceNumber =
      invoice.invoiceNumber?.trim() || invoice.providerInvoiceId;
    const publicViewUrl = buildInvoiceViewUrl(invoice.id);
    const baseAppUrl = coreEnv.NEXT_PUBLIC_APP_URL;
    const absoluteReturnUrl = publicViewUrl.startsWith("http")
      ? publicViewUrl
      : `${baseAppUrl}/${locale}${publicViewUrl.startsWith("/") ? "" : "/"}${publicViewUrl}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            unit_amount: openCents,
            product_data: {
              name: `Invoice ${invoiceNumber}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: ERP_INVOICE_CHECKOUT_TYPE,
        invoiceId: invoice.id,
        companyId,
        invoiceNumber,
        expectedCents: String(openCents),
        currency: invoice.currency.toUpperCase(),
      },
      success_url: `${absoluteReturnUrl}${absoluteReturnUrl.includes("?") ? "&" : "?"}paid=1`,
      cancel_url: absoluteReturnUrl,
    });

    const checkoutUrl = session.url ?? absoluteReturnUrl;
    const checkoutRecord = {
      sessionId: session.id,
      url: checkoutUrl,
      expectedCents: openCents,
      currency: invoice.currency.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    await db
      .update(paymentInvoices)
      .set({
        invoiceUrl: checkoutUrl,
        metadata: sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || jsonb_build_object('stripeCheckout', ${JSON.stringify(checkoutRecord)}::jsonb)`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(paymentInvoices.id, invoice.id),
          eq(paymentInvoices.companyId, companyId),
        ),
      );

    return success({
      invoiceId: invoice.id,
      sessionId: session.id,
      paymentUrl: checkoutUrl,
      amountCents: openCents,
      currency: invoice.currency,
      reused: false,
    });
  } catch (error) {
    logger.error(
      "Failed to prepare Stripe invoice checkout",
      parseError(error),
    );
    return fail({
      message: t("errors.server.description"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
}

/**
 * Settles an ERP invoice from a verified Stripe checkout.session.completed event.
 * Runs BEFORE generic product/credit webhook processing so AR is never double-booked.
 */
export async function settleErpInvoiceFromStripeWebhook(
  eventData: WebhookData,
  logger: EndpointLogger,
  locale: CountryLanguage = defaultLocale,
): Promise<ResponseType<StripeInvoiceSettlementResult>> {
  const { t } = scopedTranslation.scopedT(locale);
  if (!isErpInvoiceWebhook(eventData)) {
    return success({ handled: false, settled: false, conflict: false });
  }

  const meta = eventData.metadata ?? {};
  const invoiceId = meta.invoiceId;
  const companyId = meta.companyId;
  const sessionId = eventData.id;
  const paidCents = eventData.amount_total ?? 0;
  const paidCurrency = (eventData.currency ?? "").toUpperCase();

  if (
    !invoiceId ||
    !companyId ||
    !sessionId ||
    !z.uuid().safeParse(invoiceId).success ||
    !z.uuid().safeParse(companyId).success ||
    paidCents <= 0
  ) {
    logger.warn("Malformed ERP invoice webhook metadata", {
      sessionId,
      invoiceId,
      companyId,
    });
    return fail({
      message: t("errors.validation.description"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }

  try {
    return await db.transaction(async (tx) => {
      await lockLedgerCompany(tx, companyId);

      const [invoice] = await tx
        .select()
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.id, invoiceId),
            eq(paymentInvoices.companyId, companyId),
          ),
        )
        .limit(1)
        .for("update");
      if (!invoice) {
        return fail({
          message: t("errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const receiptKey = `stripe-checkout:${sessionId}`;
      const [existingReceipt] = await tx
        .select()
        .from(paymentInvoiceReceipts)
        .where(
          and(
            eq(paymentInvoiceReceipts.scopeId, companyId),
            eq(paymentInvoiceReceipts.isCompanyScope, true),
            eq(paymentInvoiceReceipts.receiptKey, receiptKey),
          ),
        )
        .limit(1);
      if (existingReceipt) {
        return success({
          handled: true,
          settled: true,
          conflict: false,
          invoiceId: invoice.id,
          journalEntryId: existingReceipt.journalEntryId,
        });
      }

      const [settings] = await tx
        .select()
        .from(companyPaymentSettings)
        .where(eq(companyPaymentSettings.companyId, companyId))
        .limit(1);

      const balanceParts = getInvoiceOpenBalanceParts(
        tx,
        companyId,
        invoice.currency,
      );
      const [bal] = await tx
        .select({ openAmount: balanceParts.openAmount })
        .from(paymentInvoices)
        .leftJoin(balanceParts.payments, balanceParts.paymentJoin)
        .leftJoin(balanceParts.credits, balanceParts.creditJoin)
        .where(eq(paymentInvoices.id, invoice.id))
        .limit(1);
      const openCents = Math.round(
        Number(bal?.openAmount ?? invoice.amount) * 100,
      );

      // Conflict detection: voided, already settled, currency mismatch, or overpayment
      const hasConflict =
        invoice.status !== InvoiceStatus.OPEN ||
        invoice.currency.toUpperCase() !== paidCurrency ||
        paidCents !== openCents;

      if (hasConflict) {
        const conflictNote = {
          sessionId,
          paidCents,
          paidCurrency,
          expectedOpenCents: openCents,
          invoiceStatus: invoice.status,
          recordedAt: new Date().toISOString(),
        };
        await tx
          .update(paymentInvoices)
          .set({
            metadata: sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || jsonb_build_object('stripePaymentConflict', ${JSON.stringify(conflictNote)}::jsonb)`,
            updatedAt: new Date(),
          })
          .where(eq(paymentInvoices.id, invoice.id));
        logger.warn("Stripe invoice payment conflict flagged for review", {
          invoiceId: invoice.id,
          sessionId,
          paidCents,
          openCents,
          status: invoice.status,
        });
        return success({
          handled: true,
          settled: false,
          conflict: true,
          invoiceId: invoice.id,
        });
      }

      const autoBook = settings?.autoBookStripePayments ?? true;
      let journalEntryId: string | null = null;
      const invoiceLabel =
        invoice.invoiceNumber?.trim() || invoice.providerInvoiceId;

      if (autoBook) {
        journalEntryId = await postJournalEntry(
          {
            companyId,
            date: new Date(),
            description: `Stripe payment: ${invoiceLabel}`,
            sourceType: JournalSourceType.AR_PAYMENT,
            sourceId: invoice.id,
            postedByUserId: invoice.userId,
            lines: [
              {
                accountNodeId: settings?.stripeClearingAccountId ?? undefined,
                subtype: AccountSubtype.BANK,
                type: LineType.DEBIT,
                amount: paidCents / 100,
                currency: invoice.currency,
              },
              {
                subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                type: LineType.CREDIT,
                amount: paidCents / 100,
                currency: invoice.currency,
              },
            ],
            logger,
          },
          tx,
        );
      }

      const requestDigest = createHash("sha256")
        .update(
          `${companyId}:${invoice.id}:${sessionId}:${paidCents}:${paidCurrency}`,
        )
        .digest("hex");

      await tx.insert(paymentInvoiceReceipts).values({
        invoiceId: invoice.id,
        scopeId: companyId,
        isCompanyScope: true,
        receiptKey,
        requestDigest,
        journalEntryId,
        response: { success: true, message: null },
      });

      await tx
        .update(paymentInvoices)
        .set({
          status: InvoiceStatus.PAID,
          paidAt: new Date(),
          metadata: autoBook
            ? sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || jsonb_build_object('stripeSettledSessionId', ${JSON.stringify(sessionId)}::jsonb)`
            : sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || jsonb_build_object('stripeSettledSessionId', ${JSON.stringify(sessionId)}::jsonb, 'needsBooking', true)`,
          updatedAt: new Date(),
        })
        .where(eq(paymentInvoices.id, invoice.id));

      return success({
        handled: true,
        settled: true,
        conflict: false,
        invoiceId: invoice.id,
        journalEntryId,
      });
    });
  } catch (error) {
    logger.error(
      "Failed to settle ERP invoice from Stripe webhook",
      parseError(error),
    );
    return fail({
      message: t("errors.server.description"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
