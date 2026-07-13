/**
 * AP Bill Pay Repository
 * Marks APPROVED bill as PAID and posts payment journal entry:
 *   Dr: AP accountNode
 *   Cr: Bank/Cash accountNode
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";
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

import { paymentBills } from "../../../db";
import { BillStatus } from "../../../enum";
import type {
  BillPayRequestOutput,
  BillPayResponseOutput,
  BillPayUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class BillPayRepository {
  static async payBill(
    userId: string,
    urlPathParams: BillPayUrlPathParams,
    data: BillPayRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<BillPayResponseOutput>> {
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

      if (bill.status !== BillStatus.APPROVED) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const paidAt = data.paidAt ? new Date(data.paidAt) : new Date();

      // Post payment journal entry (Dr: AP / Cr: Bank)
      await BillPayRepository.postPaymentJournal(
        bill,
        data.accountNodeId ?? null,
        paidAt,
        userId,
        logger,
      );

      await db
        .update(paymentBills)
        .set({
          status: BillStatus.PAID,
          paidAt,
          updatedAt: new Date(),
        })
        .where(eq(paymentBills.id, urlPathParams.billId));

      logger.info("AP bill marked as paid", {
        billId: bill.id,
        paidAt,
      });

      return success({
        status: BillStatus.PAID,
        paidAtResponse: paidAt,
      });
    } catch (error) {
      logger.error("Failed to pay AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Posts payment journal entry:
   * Dr: Accounts Payable
   * Cr: Bank/Cash accountNode
   */
  private static async postPaymentJournal(
    bill: {
      id: string;
      companyId: string;
      currency: string;
      total: number;
      supplierName: string;
    },
    accountNodeId: string | null,
    paidAt: Date,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Find AP account
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
        logger.warn("No ACCOUNTS_PAYABLE account — skipping payment journal", {
          companyId: bill.companyId,
        });
        return;
      }

      // Resolve Bank/Cash account — prefer provided ID, fall back to first BANK account
      let bankAccountId = accountNodeId;
      if (!bankAccountId) {
        const [bankAccount] = await db
          .select()
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.companyId, bill.companyId),
              eq(accountNodes.subtype, AccountSubtype.BANK),
              eq(accountNodes.isActive, true),
            ),
          )
          .limit(1);

        bankAccountId = bankAccount?.id ?? null;
      }

      if (!bankAccountId) {
        logger.warn("No Bank/Cash account — skipping payment journal", {
          companyId: bill.companyId,
        });
        return;
      }

      // Find open period
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
        logger.warn("No open period — skipping payment journal", {
          companyId: bill.companyId,
        });
        return;
      }

      // Generate entry number
      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(journalEntries)
        .where(eq(journalEntries.periodId, period.id));

      const entrySeq = (existingCount ?? 0) + 1;
      const year = paidAt.getFullYear();
      const entryNumber = `JE-${year}-${String(entrySeq).padStart(4, "0")}`;

      const [entry] = await db
        .insert(journalEntries)
        .values({
          companyId: bill.companyId,
          periodId: period.id,
          entryNumber,
          date: paidAt,
          description: `AP Payment: ${bill.supplierName}`,
          sourceType: JournalSourceType.AP_PAYMENT,
          sourceId: bill.id,
          status: JournalEntryStatus.POSTED,
          postedAt: new Date(),
          postedByUserId: userId,
        })
        .returning({ id: journalEntries.id });

      if (!entry) {
        return;
      }

      // Dr: AP
      await db.insert(journalEntryLines).values({
        journalEntryId: entry.id,
        accountId: apAccount.id,
        type: LineType.DEBIT,
        amount: bill.total,
        currency: bill.currency,
        description: `Pay AP: ${bill.supplierName}`,
        sortOrder: 0,
      });

      // Cr: Bank/Cash
      await db.insert(journalEntryLines).values({
        journalEntryId: entry.id,
        accountId: bankAccountId,
        type: LineType.CREDIT,
        amount: bill.total,
        currency: bill.currency,
        description: `Pay AP: ${bill.supplierName}`,
        sortOrder: 1,
      });

      logger.info("AP payment journal entry posted", {
        entryId: entry.id,
        billId: bill.id,
        total: bill.total,
      });
    } catch (error) {
      logger.error("Failed to post AP payment journal", parseError(error));
    }
  }
}
