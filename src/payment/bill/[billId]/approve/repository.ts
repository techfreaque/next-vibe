/**
 * Receives supplier bills and posts approved bills to accounts payable.
 */

import "server-only";

import { and, eq, inArray, isNull } from "drizzle-orm";
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
import { TaxCalculator } from "@/tax/calculator";

import { paymentBillLines, paymentBills } from "../../../db";
import { BillStatus } from "../../../enum";
import type {
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

          const billLines = await tx
            .select()
            .from(paymentBillLines)
            .where(eq(paymentBillLines.billId, bill.id))
            .orderBy(paymentBillLines.sortOrder, paymentBillLines.id);
          const explicitAccountIds = billLines.flatMap(({ expenseAccountId }) =>
            expenseAccountId ? [expenseAccountId] : [],
          );
          const expenseAccounts = explicitAccountIds.length
            ? await tx
                .select({ id: accountNodes.id })
                .from(accountNodes)
                .where(
                  and(
                    inArray(accountNodes.id, explicitAccountIds),
                    eq(accountNodes.companyId, bill.companyId),
                    eq(accountNodes.type, AccountType.EXPENSE),
                    eq(accountNodes.isActive, true),
                    eq(accountNodes.isPostable, true),
                  ),
                )
                .orderBy(accountNodes.id)
                .for("share")
            : [];
          const expenseAccountIds = new Set(
            expenseAccounts.map(({ id }) => id),
          );
          const lineTaxUnits = billLines.reduce(
            (total, line) => total + Math.round(line.taxAmount * 10_000),
            0,
          );
          if (
            lineTaxUnits !== Math.round(bill.taxAmount * 10_000) ||
            billLines.length === 0 ||
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
              line.lineTotal - line.taxAmount,
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
          if (bill.taxAmount > 0) {
            lines.push({
              subtype: AccountSubtype.VAT_RECEIVABLE,
              type: LineType.DEBIT,
              amount: bill.taxAmount,
              currency: bill.currency,
              description: "VAT receivable",
            });
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
          .set({ status, journalEntryId, updatedAt: new Date() })
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
