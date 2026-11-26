/**
 * AP Bill Get Repository
 * Retrieves a single bill with all line items
 */

import "server-only";

import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { journalEntries } from "@/chart-of-accounts/db";
import {
  JournalEntryStatus,
  JournalSourceType,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import {
  findBankBillStatement,
  hasSupplierBillCandidate,
  readBankBillOrigin,
} from "@/finance/bank/followup/bill-provenance";
import {
  canManageCompanyDocuments,
  getDocumentCompanies,
} from "@/finance/document-company-scope";
import { mailboxTaxPending } from "@/finance/supplier-evidence/tax-pending";
import { BillStatus } from "@/payment/enum";
import { getLineSettlementPolicy } from "@/tax/line-settlement";
import { CompanyTaxRegime } from "@/tax/regime/enum";
import { getCompanyTaxRegime } from "@/tax/regime/policy";

import { paymentBillLines, paymentBills } from "../../../db";
import {
  billLinesMatchHeader,
  hasBillSourceEvidence,
} from "../../create/amounts";
import type { BillGetResponseOutput, BillGetUrlPathParams } from "./definition";
import { scopedTranslation } from "./i18n";

export class BillGetRepository {
  static async getBill(
    userId: string,
    urlPathParams: BillGetUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, urlPathParams.billId))
        .limit(1);

      if (!bill) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        bill.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const [company] = await getDocumentCompanies(userId, bill.companyId);
      if (!company) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const lines = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, bill.id))
        .orderBy(paymentBillLines.sortOrder);

      const journalReferences =
        bill.journalEntryId || bill.status === BillStatus.PAID
          ? await db
              .select({
                id: journalEntries.id,
                number: journalEntries.entryNumber,
                sourceType: journalEntries.sourceType,
              })
              .from(journalEntries)
              .where(
                and(
                  eq(journalEntries.companyId, bill.companyId),
                  eq(journalEntries.sourceId, bill.id),
                  isNull(journalEntries.reversalOfId),
                  inArray(journalEntries.status, [
                    JournalEntryStatus.POSTED,
                    JournalEntryStatus.REVERSED,
                  ]),
                  or(
                    bill.journalEntryId
                      ? and(
                          eq(journalEntries.id, bill.journalEntryId),
                          eq(
                            journalEntries.sourceType,
                            JournalSourceType.AP_BILL,
                          ),
                        )
                      : undefined,
                    bill.status === BillStatus.PAID
                      ? eq(
                          journalEntries.sourceType,
                          JournalSourceType.AP_PAYMENT,
                        )
                      : undefined,
                  ),
                ),
              )
              .orderBy(
                sql`CASE WHEN ${journalEntries.sourceType} = ${JournalSourceType.AP_BILL} THEN 0 ELSE 1 END`,
              )
              .limit(3)
          : [];
      const approval = journalReferences.find(
        ({ sourceType }) => sourceType === JournalSourceType.AP_BILL,
      );
      const payments = journalReferences.filter(
        ({ sourceType }) => sourceType === JournalSourceType.AP_PAYMENT,
      );
      const payment = payments.length === 1 ? payments[0] : undefined;

      const taxSnapshot = z
        .object({
          inputVatDeductible: z.boolean().optional(),
          reverseCharge: z
            .object({
              base: z.number(),
              ratePercent: z.number(),
              amount: z.number(),
            })
            .nullish(),
        })
        .safeParse(bill.metadata);
      const canManage = canManageCompanyDocuments(authResult.data.role);
      const bankOrigin = readBankBillOrigin(bill);
      const bankStatement =
        canManage && bankOrigin
          ? await findBankBillStatement(db, bill, bankOrigin)
          : undefined;
      const bankSupplierDocument = bankOrigin?.originalSupplierInvoicePending
        ? "missing"
        : bankOrigin?.supplierDocumentLinkedAfterPosting
          ? "linkedAfterPosting"
          : undefined;
      const vendor = z.object({ vendorId: z.uuid() }).safeParse(bill.metadata);
      const possibleBankDuplicate =
        canManage &&
        bill.status === BillStatus.RECEIVED &&
        (bankSupplierDocument === "missing" ||
          (!bankOrigin && Boolean(bill.billNumber?.trim()))) &&
        (await hasSupplierBillCandidate(
          db,
          {
            companyId: bill.companyId,
            vendorId: vendor.success ? vendor.data.vendorId : null,
            supplierName: bill.supplierName,
            currency: bill.currency,
            total: bill.total,
            date: bill.billDate,
            excludedBillId: bill.id,
          },
          bankSupplierDocument === "missing"
            ? "numbered-document"
            : "bank-pending",
        ));
      const canRecordReverseCharge =
        canManage &&
        bankSupplierDocument !== "missing" &&
        bill.status === BillStatus.RECEIVED &&
        (await getCompanyTaxRegime(db, bill.companyId, bill.billDate)).code ===
          CompanyTaxRegime.DE_SMALL_BUSINESS;
      const pendingTax = mailboxTaxPending(bill.metadata);
      const reviewLineTotals =
        canManage &&
        bill.status === BillStatus.DRAFT &&
        !pendingTax &&
        !hasBillSourceEvidence(bill.metadata) &&
        !billLinesMatchHeader(bill, lines);
      return success({
        id: bill.id,
        taxPending: Boolean(pendingTax),
        lineReviewRequired: reviewLineTotals,
        taxReviewId: canManage ? pendingTax?.reviewId : undefined,
        companyName: company.name,
        canManage,
        canRecordReverseCharge,
        bankSupplierDocument,
        bankBookedDate: bankStatement?.bookedDate,
        possibleBankDuplicate,
        bankVendorId: canManage ? bankOrigin?.vendorId : undefined,
        bankExpenseAccountId: canManage
          ? bankOrigin?.expenseAccountId
          : undefined,
        inputVatDeductible: taxSnapshot.success
          ? (taxSnapshot.data.inputVatDeductible ?? null)
          : null,
        reverseCharge: taxSnapshot.success
          ? (taxSnapshot.data.reverseCharge ?? null)
          : null,
        companyId: bill.companyId,
        supplierName: bill.supplierName,
        supplierVatNumber: bill.supplierVatNumber,
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        currency: bill.currency,
        lineSettlement: getLineSettlementPolicy(bill.currency, bill.metadata),
        canEditLines:
          canManage &&
          bill.status === BillStatus.DRAFT &&
          !bill.journalEntryId &&
          !hasBillSourceEvidence(bill.metadata) &&
          !reviewLineTotals,
        subtotal: pendingTax ? null : bill.subtotal,
        taxAmount: pendingTax ? null : bill.taxAmount,
        total: bill.total,
        status: bill.status,
        notes: bill.notes,
        journalEntryId: approval?.id ?? null,
        approvalJournal: approval && {
          id: approval.id,
          number: approval.number,
        },
        settlementJournal: payment && {
          id: payment.id,
          number: payment.number,
        },
        paidAt: bill.paidAt,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
        lines: lines.map((l) => ({
          id: l.id,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRate: l.taxRate,
          taxAmount: l.taxAmount,
          lineTotal: l.lineTotal,
        })),
      });
    } catch (error) {
      logger.error("Failed to get AP bill", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
