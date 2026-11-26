/**
 * Receives supplier bills and posts approved bills to accounts payable.
 */

import "server-only";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
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

import { accountNodes, journalEntries } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import {
  findBankBillStatement,
  hasSupplierBillCandidate,
  readBankBillOrigin,
} from "@/finance/bank/followup/bill-provenance";
import { isConfirmedPrepaidSupplierBill } from "@/finance/supplier-evidence/prepaid-bill";
import { mailboxTaxPending } from "@/finance/supplier-evidence/tax-pending";
import { scopedTranslation as billDetailTranslation } from "@/payment/bill/[billId]/get/i18n";
import { TaxCalculator } from "@/tax/calculator";
import { CompanyTaxRegime } from "@/tax/regime/enum";
import { getCompanyTaxRegime } from "@/tax/regime/policy";
import { reverseChargeDecision } from "@/tax/regime/reverse-charge";

import { paymentBillLines, paymentBills } from "../../../db";
import { BillStatus } from "../../../enum";
import type {
  BillApprovalTaxInputs,
  BillApproveResponseOutput,
  BillApproveUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillApproveRepository {
  static async approveBill(
    userId: string,
    urlPathParams: BillApproveUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    taxInputs: BillApprovalTaxInputs = {},
  ): Promise<ResponseType<BillApproveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [observedBill] = await db
        .select({
          companyId: paymentBills.companyId,
          status: paymentBills.status,
        })
        .from(paymentBills)
        .where(eq(paymentBills.id, urlPathParams.billId))
        .limit(1);

      if (!observedBill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        observedBill.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, observedBill.companyId);
        const [bill] = await tx
          .select()
          .from(paymentBills)
          .where(
            and(
              eq(paymentBills.id, urlPathParams.billId),
              eq(paymentBills.companyId, observedBill.companyId),
            ),
          )
          .limit(1)
          .for("update");

        if (!bill) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (mailboxTaxPending(bill.metadata)) {
          return fail({
            message: billDetailTranslation
              .scopedT(locale)
              .t("widget.taxPending"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        if (
          bill.status !== observedBill.status ||
          bill.journalEntryId ||
          (bill.status !== BillStatus.DRAFT &&
            bill.status !== BillStatus.RECEIVED)
        ) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (bill.total <= 0) {
          return fail({
            message: t("post.errors.billLines"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const status =
          bill.status === BillStatus.DRAFT
            ? BillStatus.RECEIVED
            : BillStatus.APPROVED;
        const reverseCharge = reverseChargeDecision(
          taxInputs.reverseChargeBase,
          taxInputs.reverseChargeRatePercent,
          bill.total,
        );
        if (
          reverseCharge === false ||
          (reverseCharge && status !== BillStatus.APPROVED)
        ) {
          return fail({
            message: t("reverseCharge.invalid"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const bankOrigin = readBankBillOrigin(bill);
        const missingDocument =
          bankOrigin?.originalSupplierInvoicePending === true;
        if (
          status === BillStatus.APPROVED &&
          missingDocument &&
          (!taxInputs.confirmNoSupplierDocument ||
            bill.billNumber ||
            bill.taxAmount !== 0 ||
            reverseCharge ||
            !(await findBankBillStatement(tx, bill, bankOrigin)))
        ) {
          return fail({
            message: t("supplierDocument.required"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        if (
          status === BillStatus.APPROVED &&
          !taxInputs.confirmSeparateBankBill &&
          (missingDocument || (!bankOrigin && Boolean(bill.billNumber?.trim())))
        ) {
          const vendor = z
            .object({ vendorId: z.uuid() })
            .safeParse(bill.metadata);
          const possibleDuplicate = await hasSupplierBillCandidate(
            tx,
            {
              companyId: bill.companyId,
              vendorId: vendor.success ? vendor.data.vendorId : null,
              supplierName: bill.supplierName,
              currency: bill.currency,
              total: bill.total,
              date: bill.billDate,
              excludedBillId: bill.id,
            },
            missingDocument ? "numbered-document" : "bank-pending",
          );
          if (possibleDuplicate) {
            return fail({
              message: t("supplierDocument.possibleDuplicate"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
        }
        let deductible = !missingDocument;
        let journalEntryId: string | null = null;
        if (status === BillStatus.APPROVED) {
          const [existingPosting] = await tx
            .select({ id: journalEntries.id })
            .from(journalEntries)
            .where(
              and(
                eq(journalEntries.companyId, bill.companyId),
                eq(journalEntries.sourceType, JournalSourceType.AP_BILL),
                eq(journalEntries.sourceId, bill.id),
                inArray(journalEntries.status, [
                  JournalEntryStatus.DRAFT,
                  JournalEntryStatus.POSTED,
                ]),
                isNull(journalEntries.reversalOfId),
              ),
            )
            .limit(1);
          if (existingPosting) {
            return fail({
              message: t("post.errors.existingPosting"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }

          const regime = await getCompanyTaxRegime(
            tx,
            bill.companyId,
            bill.billDate,
          );
          deductible = !regime.exempt && !missingDocument;
          if (
            reverseCharge &&
            regime.code !== CompanyTaxRegime.DE_SMALL_BUSINESS
          ) {
            return fail({
              message: t("reverseCharge.invalid"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const billLines = await tx
            .select()
            .from(paymentBillLines)
            .where(eq(paymentBillLines.billId, bill.id))
            .orderBy(paymentBillLines.sortOrder, paymentBillLines.id);
          const lineTaxUnits = billLines.reduce(
            (total, line) => total + Math.round(line.taxAmount * 10_000),
            0,
          );
          const lineGrossUnits = billLines.reduce(
            (total, line) => total + Math.round(line.lineTotal * 10_000),
            0,
          );
          if (
            billLines.length > 0 &&
            (lineTaxUnits !== Math.round(bill.taxAmount * 10_000) ||
              lineGrossUnits !== Math.round(bill.total * 10_000) ||
              lineGrossUnits - lineTaxUnits !==
                Math.round(bill.subtotal * 10_000))
          ) {
            return fail({
              message: t("post.errors.lineTotalsReview"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          const explicitAccountIds = billLines.flatMap(({ expenseAccountId }) =>
            expenseAccountId ? [expenseAccountId] : [],
          );
          const expenseAccounts = explicitAccountIds.length
            ? await tx
                .select({
                  id: accountNodes.id,
                  type: accountNodes.type,
                  subtype: accountNodes.subtype,
                })
                .from(accountNodes)
                .where(
                  and(
                    inArray(accountNodes.id, explicitAccountIds),
                    eq(accountNodes.companyId, bill.companyId),
                    eq(accountNodes.isActive, true),
                    eq(accountNodes.isPostable, true),
                  ),
                )
                .orderBy(accountNodes.id)
                .for("share")
            : [];
          const expenseAccountIds = new Set<string>();
          for (const account of expenseAccounts) {
            if (
              account.type === AccountType.EXPENSE ||
              (account.type === AccountType.ASSET &&
                account.subtype === AccountSubtype.PREPAID &&
                (await isConfirmedPrepaidSupplierBill(tx, bill, account.id)))
            ) {
              expenseAccountIds.add(account.id);
            }
          }
          if (
            billLines.length === 0 ||
            (missingDocument &&
              (billLines.length !== 1 ||
                billLines[0]?.expenseAccountId !==
                  bankOrigin.expenseAccountId ||
                billLines[0]?.lineTotal !== bill.total)) ||
            billLines.some(
              ({ expenseAccountId, lineTotal, taxAmount }) =>
                (expenseAccountId !== null &&
                  !expenseAccountIds.has(expenseAccountId)) ||
                taxAmount < 0 ||
                lineTotal < taxAmount,
            )
          ) {
            return fail({
              message: t("post.errors.billLines"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }

          const lines: AutoPostLine[] = [];
          for (const line of billLines) {
            const net = TaxCalculator.roundToFour(
              deductible ? line.lineTotal - line.taxAmount : line.lineTotal,
            );
            if (net > 0) {
              lines.push({
                subtype: AccountSubtype.OPEX,
                accountNodeId: line.expenseAccountId ?? undefined,
                type: LineType.DEBIT,
                amount: net,
                currency: bill.currency,
                description: line.description,
              });
            }
          }
          if (deductible && bill.taxAmount > 0) {
            lines.push({
              subtype: AccountSubtype.VAT_RECEIVABLE,
              type: LineType.DEBIT,
              amount: bill.taxAmount,
              currency: bill.currency,
              description: "VAT receivable",
            });
          }
          if (reverseCharge) {
            lines.push(
              {
                subtype: AccountSubtype.OPEX,
                type: LineType.DEBIT,
                amount: reverseCharge.amount,
                currency: bill.currency,
                description: t("reverseCharge.cost"),
              },
              {
                subtype: AccountSubtype.VAT_PAYABLE,
                type: LineType.CREDIT,
                amount: reverseCharge.amount,
                currency: bill.currency,
                description: t("reverseCharge.title"),
              },
            );
          }
          lines.push({
            subtype: AccountSubtype.ACCOUNTS_PAYABLE,
            type: LineType.CREDIT,
            amount: bill.total,
            currency: bill.currency,
            description: bill.supplierName,
          });

          journalEntryId = await postJournalEntry(
            {
              companyId: bill.companyId,
              date: bill.billDate,
              description: `AP bill: ${bill.supplierName}`,
              sourceType: JournalSourceType.AP_BILL,
              sourceId: bill.id,
              postedByUserId: userId,
              lines,
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
        }

        await tx
          .update(paymentBills)
          .set({
            status,
            journalEntryId,
            updatedAt: new Date(),
            ...(status === BillStatus.APPROVED
              ? {
                  metadata: sql`coalesce(${paymentBills.metadata}, '{}'::jsonb) || ${JSON.stringify(
                    {
                      inputVatDeductible: deductible,
                      reverseCharge: reverseCharge ?? null,
                      ...(taxInputs.confirmSeparateBankBill
                        ? {
                            separateBankChargeConfirmedAt:
                              new Date().toISOString(),
                            separateBankChargeConfirmedBy: userId,
                          }
                        : {}),
                      ...(missingDocument
                        ? {
                            noSupplierDocumentConfirmedAt:
                              new Date().toISOString(),
                            noSupplierDocumentConfirmedBy: userId,
                          }
                        : {}),
                    },
                  )}::jsonb`,
                }
              : {}),
          })
          .where(eq(paymentBills.id, bill.id));

        logger.info("AP bill status advanced", {
          billId: bill.id,
          from: bill.status,
          to: status,
          journalEntryId,
        });

        return success({ status, journalEntryId });
      });
    } catch (error) {
      logger.error("Failed to approve AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
