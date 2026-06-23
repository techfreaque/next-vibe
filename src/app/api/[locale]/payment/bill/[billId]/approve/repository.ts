/**
 * AP Bill Approve Repository
 * Advances bill status: DRAFT→RECEIVED→APPROVED
 * On APPROVED: posts journal entry (Dr Expense / Dr VAT Receivable / Cr AP)
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/app/api/[locale]/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/app/api/[locale]/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentBillLines, paymentBills } from "../../../db";
import type { BillStatusDBType } from "../../../enum";
import { BillStatus } from "../../../enum";
import type {
  BillApproveResponseOutput,
  BillApproveUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

// Status transition map: DRAFT→RECEIVED→APPROVED
const NEXT_STATUS: Partial<Record<BillStatusDBType, BillStatusDBType>> = {
  [BillStatus.DRAFT]: BillStatus.RECEIVED,
  [BillStatus.RECEIVED]: BillStatus.APPROVED,
};

export class BillApproveRepository {
  static async approveBill(
    userId: string,
    urlPathParams: BillApproveUrlPathParams,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillApproveResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, urlPathParams.billId))
        .limit(1);

      if (!bill) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify ACCOUNTANT+ membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        bill.companyId,
        CompanyMemberRole.ACCOUNTANT,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const nextStatus = NEXT_STATUS[bill.status];
      if (!nextStatus) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      let journalEntryId: string | null = bill.journalEntryId;

      // Post journal entry when transitioning to APPROVED
      if (nextStatus === BillStatus.APPROVED) {
        journalEntryId = await BillApproveRepository.postApprovalJournal(
          bill,
          userId,
          logger,
        );
      }

      await db
        .update(paymentBills)
        .set({
          status: nextStatus,
          journalEntryId,
          updatedAt: new Date(),
        })
        .where(eq(paymentBills.id, urlPathParams.billId));

      logger.info("AP bill status advanced", {
        billId: bill.id,
        from: bill.status,
        to: nextStatus,
      });

      return success({
        status: nextStatus,
        journalEntryId,
      });
    } catch (error) {
      logger.error("Failed to approve AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Posts the AP approval journal entry:
   * Dr: Expense accounts (from line.expenseAccountId or OPEX fallback)
   * Dr: VAT Receivable (if taxAmount > 0)
   * Cr: Accounts Payable
   *
   * Returns the created journal entry ID, or null if accounts not found.
   */
  private static async postApprovalJournal(
    bill: {
      id: string;
      companyId: string;
      currency: string;
      subtotal: number;
      taxAmount: number;
      total: number;
      billDate: Date;
      supplierName: string;
    },
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      // Find AP account node
      const [apAccount] = await db
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, bill.companyId),
            eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_PAYABLE),
            eq(accountNodes.isActive, true),
          ),
        )
        .limit(1);

      if (!apAccount) {
        logger.warn(
          "No ACCOUNTS_PAYABLE account found — skipping journal post",
          {
            companyId: bill.companyId,
          },
        );
        return null;
      }

      // Find open period covering the bill date
      const [period] = await db
        .select()
        .from(accountingPeriods)
        .where(
          and(
            eq(accountingPeriods.companyId, bill.companyId),
            eq(accountingPeriods.status, PeriodStatus.OPEN),
          ),
        )
        .limit(1);

      if (!period) {
        logger.warn("No open accounting period — skipping journal post", {
          companyId: bill.companyId,
        });
        return null;
      }

      // Get bill lines to resolve expense accounts
      const lines = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, bill.id));

      // Generate entry number
      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(journalEntries)
        .where(eq(journalEntries.periodId, period.id));

      const entrySeq = (existingCount ?? 0) + 1;
      const year = bill.billDate.getFullYear();
      const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

      const [entry] = await db
        .insert(journalEntries)
        .values({
          companyId: bill.companyId,
          periodId: period.id,
          entryNumber,
          date: bill.billDate,
          description: `AP Bill: ${bill.supplierName}`,
          sourceType: JournalSourceType.AP_BILL,
          sourceId: bill.id,
          status: JournalEntryStatus.POSTED,
          postedAt: new Date(),
          postedByUserId: userId,
        })
        .returning({ id: journalEntries.id });

      if (!entry) {
        return null;
      }

      let sortOrder = 0;

      // Dr: Expense lines
      for (const line of lines) {
        let expenseAccountId = line.expenseAccountId;

        if (!expenseAccountId) {
          // Fall back to OPEX account
          const [opexAccount] = await db
            .select()
            .from(accountNodes)
            .where(
              and(
                eq(accountNodes.companyId, bill.companyId),
                eq(accountNodes.subtype, AccountSubtype.OPEX),
                eq(accountNodes.isActive, true),
              ),
            )
            .limit(1);

          expenseAccountId = opexAccount?.id ?? null;
        }

        if (!expenseAccountId) {
          logger.warn("No expense account for bill line — skipping debit", {
            lineId: line.id,
          });
          continue;
        }

        const lineNet = line.lineTotal - line.taxAmount;
        await db.insert(journalEntryLines).values({
          journalEntryId: entry.id,
          accountId: expenseAccountId,
          type: LineType.DEBIT,
          amount: lineNet,
          currency: bill.currency,
          description: line.description,
          sortOrder: sortOrder++,
        });
      }

      // Dr: VAT Receivable (if tax > 0)
      if (bill.taxAmount > 0) {
        const [vatAccount] = await db
          .select()
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.companyId, bill.companyId),
              eq(accountNodes.subtype, AccountSubtype.VAT_RECEIVABLE),
              eq(accountNodes.isActive, true),
            ),
          )
          .limit(1);

        if (vatAccount) {
          await db.insert(journalEntryLines).values({
            journalEntryId: entry.id,
            accountId: vatAccount.id,
            type: LineType.DEBIT,
            amount: bill.taxAmount,
            currency: bill.currency,
            description: "VAT receivable",
            sortOrder: sortOrder++,
          });
        }
      }

      // Cr: Accounts Payable
      await db.insert(journalEntryLines).values({
        journalEntryId: entry.id,
        accountId: apAccount.id,
        type: LineType.CREDIT,
        amount: bill.total,
        currency: bill.currency,
        description: `AP: ${bill.supplierName}`,
        sortOrder: sortOrder++,
      });

      logger.info("AP approval journal entry posted", {
        entryId: entry.id,
        billId: bill.id,
        total: bill.total,
      });

      return entry.id;
    } catch (error) {
      logger.error("Failed to post AP approval journal", parseError(error));
      return null;
    }
  }
}
