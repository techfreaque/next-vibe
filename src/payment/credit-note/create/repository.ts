/**
 * Issues a credit note against a posted company invoice.
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
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
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { accountingDay } from "@/chart-of-accounts/shared/journal-validation";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { nextCompanyInvoiceSequence } from "@/finance/document-number";
import { TaxCalculator } from "@/tax/calculator";

import { paymentInvoiceLines, paymentInvoices } from "../../db";
import { InvoiceStatus } from "../../enum";
import type {
  CreditNoteCreateRequestOutput,
  CreditNoteCreateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class CreditNoteCreateRepository {
  static async createCreditNote(
    userId: string,
    data: CreditNoteCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CreditNoteCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const scope = { companyId: data.companyId };
      if (!(await getDocumentAccess(userId, scope))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, data.companyId);
        const [original] = await tx
          .select()
          .from(paymentInvoices)
          .where(
            and(
              eq(paymentInvoices.id, data.invoiceId),
              eq(paymentInvoices.companyId, data.companyId),
            ),
          )
          .limit(1)
          .for("update");

        if (!original) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (!(await getDocumentAccess(userId, scope, tx))?.canManage) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        const originalGrossCents = Math.round(Number(original.amount) * 100);
        if (
          originalGrossCents <= 0 ||
          (original.status !== InvoiceStatus.OPEN &&
            original.status !== InvoiceStatus.PAID)
        ) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const originalLines = await tx
          .select()
          .from(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.invoiceId, original.id))
          .orderBy(paymentInvoiceLines.sortOrder, paymentInvoiceLines.id);
        const originalVatCents = Math.round(
          originalLines.reduce(
            (total, line) => total + Math.round(line.taxAmount * 10_000),
            0,
          ) / 100,
        );
        const originalNetCents = originalGrossCents - originalVatCents;
        const rates = new Set(originalLines.map((line) => line.taxRate));

        const creditLines = data.lineItems?.length
          ? data.lineItems.map((line) => {
              const quantity = TaxCalculator.roundToFour(line.quantity);
              const unitPrice = TaxCalculator.roundToFour(
                Math.abs(line.unitPrice),
              );
              const taxRate = TaxCalculator.roundToFour(line.taxRate / 100);
              const { taxAmount, total } = TaxCalculator.calculateLineItemTax({
                quantity,
                unitPrice,
                taxRate,
              });
              return {
                description: line.description,
                quantity,
                unitPrice: -unitPrice,
                taxRate,
                taxAmount: -taxAmount,
                lineTotal: -total,
                productId: null,
              };
            })
          : originalLines.map((line) => ({
              description: line.description,
              quantity: line.quantity,
              unitPrice: -line.unitPrice,
              taxRate: line.taxRate,
              taxAmount: -line.taxAmount,
              lineTotal: -line.lineTotal,
              productId: line.productId,
            }));

        const grossCents = Math.round(
          creditLines.reduce(
            (total, line) => total - Math.round(line.lineTotal * 10_000),
            0,
          ) / 100,
        );
        const vatCents = Math.round(
          creditLines.reduce(
            (total, line) => total - Math.round(line.taxAmount * 10_000),
            0,
          ) / 100,
        );
        const netCents = grossCents - vatCents;
        if (
          !Number.isSafeInteger(grossCents) ||
          !Number.isSafeInteger(vatCents) ||
          grossCents <= 0 ||
          netCents < 0 ||
          vatCents < 0 ||
          creditLines.some(
            (line) =>
              line.quantity <= 0 ||
              line.lineTotal > 0 ||
              !rates.has(line.taxRate),
          )
        ) {
          return fail({
            message: t("post.errors.creditLines"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const issuedCredits = tx
          .select({
            grossCents: sql<string>`-${paymentInvoices.amount} * 100`.as(
              "gross_cents",
            ),
            vatCents:
              sql<string>`round(coalesce(sum(-${paymentInvoiceLines.taxAmount}), 0) * 100)`.as(
                "vat_cents",
              ),
          })
          .from(paymentInvoices)
          .leftJoin(
            paymentInvoiceLines,
            eq(paymentInvoiceLines.invoiceId, paymentInvoices.id),
          )
          .where(
            and(
              eq(paymentInvoices.companyId, data.companyId),
              eq(paymentInvoices.currency, original.currency),
              eq(paymentInvoices.status, InvoiceStatus.OPEN),
              sql`${paymentInvoices.amount} < 0`,
              sql`${paymentInvoices.metadata}->>'originalInvoiceId' = ${original.id}`,
            ),
          )
          .groupBy(paymentInvoices.id, paymentInvoices.amount)
          .as("issued_credits");
        const [prior] = await tx
          .select({
            grossCents:
              sql<number>`coalesce(sum(${issuedCredits.grossCents}), 0)`.mapWith(
                Number,
              ),
            vatCents:
              sql<number>`coalesce(sum(${issuedCredits.vatCents}), 0)`.mapWith(
                Number,
              ),
          })
          .from(issuedCredits);
        const priorGross = prior?.grossCents ?? 0;
        const priorVat = prior?.vatCents ?? 0;
        if (
          grossCents + priorGross > originalGrossCents ||
          vatCents + priorVat > originalVatCents ||
          netCents + priorGross - priorVat > originalNetCents
        ) {
          return fail({
            message: t("post.errors.creditLimit"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const today = new Date();
        const originalPosting = original.journalEntryId
          ? await tx
              .select({
                accountId: journalEntryLines.accountId,
                amount: journalEntryLines.amount,
                type: journalEntryLines.type,
                subtype: accountNodes.subtype,
                date: journalEntries.date,
              })
              .from(journalEntryLines)
              .innerJoin(
                journalEntries,
                eq(journalEntries.id, journalEntryLines.journalEntryId),
              )
              .innerJoin(
                accountNodes,
                eq(accountNodes.id, journalEntryLines.accountId),
              )
              .where(
                and(
                  eq(journalEntries.id, original.journalEntryId),
                  eq(journalEntries.companyId, data.companyId),
                  eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
                  eq(journalEntries.sourceId, original.id),
                  eq(journalEntries.status, JournalEntryStatus.POSTED),
                  isNull(journalEntries.reversedById),
                  isNull(journalEntries.reversalOfId),
                  eq(accountNodes.companyId, data.companyId),
                  eq(journalEntryLines.currency, original.currency),
                ),
              )
          : [];
        const receivable = originalPosting.find(
          (line) =>
            line.type === LineType.DEBIT &&
            line.subtype === AccountSubtype.ACCOUNTS_RECEIVABLE,
        );
        const revenue = originalPosting.find(
          (line) =>
            line.type === LineType.CREDIT &&
            (line.subtype === AccountSubtype.REVENUE_SERVICE ||
              line.subtype === AccountSubtype.REVENUE_SALES),
        );
        const vat = originalPosting.find(
          (line) =>
            line.type === LineType.CREDIT &&
            line.subtype === AccountSubtype.VAT_PAYABLE,
        );
        if (
          !receivable ||
          accountingDay(receivable.date) > accountingDay(today) ||
          receivable.amount !== originalGrossCents / 100 ||
          (revenue?.amount ?? 0) !== originalNetCents / 100 ||
          (vat?.amount ?? 0) !== originalVatCents / 100 ||
          originalPosting.length !==
            1 + Number(originalNetCents > 0) + Number(originalVatCents > 0)
        ) {
          return fail({
            message: t("post.errors.originalPosting"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const creditNoteId = crypto.randomUUID();
        const currency = original.currency;
        const postingLines: AutoPostLine[] = [
          {
            subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
            accountNodeId: receivable.accountId,
            type: LineType.CREDIT,
            amount: grossCents / 100,
            currency,
          },
        ];
        if (netCents > 0 && revenue) {
          postingLines.push({
            subtype: revenue.subtype,
            accountNodeId: revenue.accountId,
            type: LineType.DEBIT,
            amount: netCents / 100,
            currency,
          });
        }
        if (vatCents > 0 && vat) {
          postingLines.push({
            subtype: AccountSubtype.VAT_PAYABLE,
            accountNodeId: vat.accountId,
            type: LineType.DEBIT,
            amount: vatCents / 100,
            currency,
          });
        }

        const invoiceSequenceNumber = await nextCompanyInvoiceSequence(
          tx,
          data.companyId,
        );
        const invoiceNumber = `CN-${String(invoiceSequenceNumber).padStart(6, "0")}`;
        const journalEntryId = await postJournalEntry(
          {
            companyId: data.companyId,
            date: today,
            description: `AR credit note: ${invoiceNumber}`,
            sourceType: JournalSourceType.AR_INVOICE,
            sourceId: creditNoteId,
            postedByUserId: userId,
            lines: postingLines,
            logger,
          },
          tx,
        );
        if (!journalEntryId) {
          return fail({
            message: t("post.errors.posting"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const amount = (-grossCents / 100).toFixed(2);
        const metadata = z
          .object({ customerId: z.string().optional() })
          .safeParse(original.metadata);
        await tx.insert(paymentInvoices).values({
          id: creditNoteId,
          userId,
          companyId: data.companyId,
          providerInvoiceId: `CN-${data.companyId.slice(0, 8)}-${String(invoiceSequenceNumber).padStart(6, "0")}`,
          invoiceNumber,
          invoiceSequenceNumber,
          currency,
          status: InvoiceStatus.OPEN,
          amount,
          notes: data.reason,
          metadata: {
            originalInvoiceId: original.id,
            reason: data.reason,
            customerId: metadata.success ? metadata.data.customerId : undefined,
          },
          journalEntryId,
          createdAt: today,
          updatedAt: today,
        });
        await tx.insert(paymentInvoiceLines).values(
          creditLines.map((line, sortOrder) => ({
            ...line,
            invoiceId: creditNoteId,
            sortOrder,
          })),
        );

        logger.debug("Credit note issued", {
          creditNoteId,
          originalInvoiceId: original.id,
          amount,
          journalEntryId,
        });
        return success({
          success: true,
          message: null,
          creditNote: {
            id: creditNoteId,
            invoiceId: original.id,
            companyId: data.companyId,
            currency,
            status: InvoiceStatus.OPEN,
            amount,
            reason: data.reason,
            createdAt: today,
            updatedAt: today,
          },
        });
      });
    } catch (error) {
      logger.error("Failed to create credit note", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
