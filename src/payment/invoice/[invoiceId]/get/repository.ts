/**
 * Invoice Get Repository
 * Retrieves a single invoice with its lines, verifying company membership
 */

import "server-only";

import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
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
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { getLineSettlementPolicy } from "@/tax/line-settlement";

import {
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoiceReceipts,
  paymentInvoices,
} from "../../../db";
import { EstimateStatus, InvoiceStatus } from "../../../enum";
import { listInvoiceReminders } from "../send-reminder/history";
import type {
  InvoiceGetResponseOutput,
  InvoiceGetUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class InvoiceGetRepository {
  static async getInvoice(
    userId: string,
    urlPathParams: InvoiceGetUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const access = await getDocumentAccess(userId, invoice);
      if (!access) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);

      const metadataSchema = z.object({ customerId: z.string().optional() });
      const parsedMeta = metadataSchema.safeParse(invoice.metadata);
      const savedCustomer = z
        .object({ customerName: z.string().trim().min(1) })
        .safeParse(invoice.metadata);
      const customerId = parsedMeta.success
        ? (parsedMeta.data.customerId ?? null)
        : null;

      const quoteOrigin = z
        .object({ estimateId: z.uuid() })
        .safeParse(invoice.metadata);
      const [sourceEstimate] =
        invoice.companyId && quoteOrigin.success
          ? await db
              .select({
                id: paymentEstimates.id,
                number: paymentEstimates.estimateNumber,
              })
              .from(paymentEstimates)
              .where(
                and(
                  eq(paymentEstimates.id, quoteOrigin.data.estimateId),
                  eq(paymentEstimates.companyId, invoice.companyId),
                  eq(paymentEstimates.invoiceId, invoice.id),
                  eq(paymentEstimates.status, EstimateStatus.CONVERTED),
                ),
              )
              .limit(1)
          : [];

      const [customer] =
        customerId && z.uuid().safeParse(customerId).success
          ? await db
              .select({ name: users.publicName, legalName: users.privateName })
              .from(users)
              .where(eq(users.id, customerId))
              .limit(1)
          : [];

      const {
        payments,
        credits,
        paymentJoin,
        creditJoin,
        amountPaid,
        openAmount,
      } = getInvoiceOpenBalanceParts(
        db,
        invoice.companyId ?? undefined,
        invoice.currency,
      );
      const [balance] = await db
        .select({ amountPaid, openAmount, issuedCredit: credits.credited })
        .from(paymentInvoices)
        .leftJoin(payments, paymentJoin)
        .leftJoin(credits, creditJoin)
        .where(eq(paymentInvoices.id, invoice.id));
      const receipts = invoice.companyId
        ? await InvoiceGetRepository.listJournalReceipts(
            invoice.id,
            invoice.companyId,
            invoice.currency,
          )
        : [];
      const voidReversal =
        invoice.status === InvoiceStatus.VOID &&
        invoice.companyId &&
        invoice.journalEntryId
          ? await InvoiceGetRepository.findVoidReversal(
              invoice.id,
              invoice.companyId,
              invoice.journalEntryId,
            )
          : undefined;
      const recordedPayments = Number(balance?.amountPaid ?? 0);
      const recentReminders = access.canManage
        ? await listInvoiceReminders(invoice.id, invoice.companyId)
        : undefined;

      const remainingCredit =
        Math.max(
          0,
          Math.round(Number(invoice.amount) * 100) -
            Math.round(Number(balance?.issuedCredit ?? 0) * 100),
        ) / 100;
      return success({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        companyName: access.companyName,
        canManage: access.canManage,
        canCreateCreditNote:
          invoice.companyId !== null &&
          access.canManage &&
          remainingCredit > 0 &&
          (invoice.status === InvoiceStatus.OPEN ||
            invoice.status === InvoiceStatus.PAID),
        remainingCredit,
        companyId: invoice.companyId ?? null,
        customerId,
        customerName:
          customer?.name ??
          customer?.legalName ??
          (savedCustomer.success ? savedCustomer.data.customerName : null),
        sourceEstimate,
        invoiceSequenceNumber: invoice.invoiceSequenceNumber ?? null,
        currency: invoice.currency,
        lineSettlement: getLineSettlementPolicy(
          invoice.currency,
          invoice.metadata,
        ),
        status: invoice.status,
        amount: invoice.amount,
        amountPaid:
          invoice.status === InvoiceStatus.PAID && recordedPayments === 0
            ? Math.max(0, Number(invoice.amount))
            : recordedPayments,
        amountDue:
          invoice.status === InvoiceStatus.OPEN
            ? Number(balance?.openAmount ?? 0)
            : 0,
        dueDate: invoice.dueDate ?? null,
        paidAt: invoice.paidAt ?? null,
        notes: invoice.notes ?? null,
        journalEntryId: invoice.journalEntryId ?? null,
        voidReversal,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        receipts,
        recentReminders,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          productId: l.productId ?? null,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate ?? null,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
          sortOrder: l.sortOrder ?? null,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to get invoice", { error: parsed.message });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async findVoidReversal(
    invoiceId: string,
    companyId: string,
    originalId: string,
  ): Promise<InvoiceGetResponseOutput["voidReversal"]> {
    const reversal = alias(journalEntries, "invoice_void_reversal");
    const [linked] = await db
      .select({
        originalEntryNumber: journalEntries.entryNumber,
        entryId: reversal.id,
        entryNumber: reversal.entryNumber,
        effectiveDate: reversal.date,
      })
      .from(journalEntries)
      .innerJoin(
        reversal,
        and(
          eq(reversal.id, journalEntries.reversedById),
          eq(reversal.reversalOfId, journalEntries.id),
          eq(reversal.companyId, companyId),
          eq(reversal.sourceType, JournalSourceType.AR_INVOICE),
          eq(reversal.sourceId, invoiceId),
          eq(reversal.status, JournalEntryStatus.POSTED),
        ),
      )
      .where(
        and(
          eq(journalEntries.id, originalId),
          eq(journalEntries.companyId, companyId),
          eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
          eq(journalEntries.sourceId, invoiceId),
          eq(journalEntries.status, JournalEntryStatus.REVERSED),
          isNull(journalEntries.reversalOfId),
        ),
      )
      .limit(1);
    return linked;
  }

  private static async listJournalReceipts(
    invoiceId: string,
    companyId: string,
    currency: string,
  ): Promise<InvoiceGetResponseOutput["receipts"]> {
    const reversal = alias(journalEntries, "receipt_reversal");
    const rows = await db
      .select({
        entryId: journalEntries.id,
        entryNumber: journalEntries.entryNumber,
        reference: sql<string | null>`(
          select min(${paymentInvoiceReceipts.receiptKey})
          from ${paymentInvoiceReceipts}
          where ${paymentInvoiceReceipts.invoiceId} = ${invoiceId}
            and ${paymentInvoiceReceipts.scopeId} = ${companyId}
            and ${paymentInvoiceReceipts.isCompanyScope}
            and ${paymentInvoiceReceipts.journalEntryId} = ${journalEntries.id}
        )`,
        date: journalEntries.date,
        amount: sql`sum(${journalEntryLines.amount})`.mapWith(Number),
        status: journalEntries.status,
        reversalDate: reversal.date,
        reversalEntryNumber: reversal.entryNumber,
        reversalReason: reversal.memo,
      })
      .from(journalEntries)
      .innerJoin(
        journalEntryLines,
        eq(journalEntryLines.journalEntryId, journalEntries.id),
      )
      .innerJoin(accountNodes, eq(accountNodes.id, journalEntryLines.accountId))
      .leftJoin(
        reversal,
        and(
          eq(reversal.id, journalEntries.reversedById),
          eq(reversal.reversalOfId, journalEntries.id),
          eq(reversal.companyId, companyId),
        ),
      )
      .where(
        and(
          eq(journalEntries.companyId, companyId),
          eq(journalEntries.sourceType, JournalSourceType.AR_PAYMENT),
          eq(journalEntries.sourceId, invoiceId),
          inArray(journalEntries.status, ledgerEntryStatuses),
          isNull(journalEntries.reversalOfId),
          eq(journalEntryLines.type, LineType.CREDIT),
          eq(journalEntryLines.currency, currency),
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_RECEIVABLE),
        ),
      )
      .groupBy(journalEntries.id, reversal.id)
      .orderBy(desc(journalEntries.date), desc(journalEntries.id));
    return rows.map(({ status, ...row }) => ({
      ...row,
      reversed:
        status === JournalEntryStatus.REVERSED ||
        row.reversalEntryNumber !== null,
    }));
  }
}
