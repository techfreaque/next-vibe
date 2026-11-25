/**
 * Settles an approved supplier bill and posts the payment in the same transaction.
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

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
      const [observedBill] = await db
        .select({ companyId: paymentBills.companyId })
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

        if (bill.status !== BillStatus.APPROVED) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const payableLines = bill.journalEntryId
          ? await tx
              .select({
                accountId: journalEntryLines.accountId,
                amount: journalEntryLines.amount,
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
                  eq(journalEntries.id, bill.journalEntryId),
                  eq(journalEntries.companyId, bill.companyId),
                  eq(journalEntries.sourceType, JournalSourceType.AP_BILL),
                  eq(journalEntries.sourceId, bill.id),
                  eq(journalEntries.status, JournalEntryStatus.POSTED),
                  eq(journalEntryLines.type, LineType.CREDIT),
                  eq(journalEntryLines.currency, bill.currency),
                  eq(accountNodes.companyId, bill.companyId),
                  eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_PAYABLE),
                ),
              )
          : [];
        const [payableLine] = payableLines;
        if (payableLines.length !== 1 || payableLine?.amount !== bill.total) {
          return fail({
            message: t("post.errors.approvalPosting"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        if (data.accountNodeId) {
          const [account] = await tx
            .select({ id: accountNodes.id })
            .from(accountNodes)
            .where(
              and(
                eq(accountNodes.id, data.accountNodeId),
                eq(accountNodes.companyId, bill.companyId),
                eq(accountNodes.isActive, true),
                eq(accountNodes.isPostable, true),
                inArray(accountNodes.subtype, [
                  AccountSubtype.BANK,
                  AccountSubtype.CASH,
                ]),
              ),
            )
            .limit(1)
            .for("share");
          if (!account) {
            return fail({
              message: t("post.errors.paymentAccount"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
        }

        const paidAt = data.paidAt ? new Date(data.paidAt) : new Date();
        const journalEntryId = await postJournalEntry(
          {
            companyId: bill.companyId,
            date: paidAt,
            description: `AP payment: ${bill.supplierName}`,
            sourceType: JournalSourceType.AP_PAYMENT,
            sourceId: bill.id,
            postedByUserId: userId,
            lines: [
              {
                subtype: AccountSubtype.ACCOUNTS_PAYABLE,
                accountNodeId: payableLine.accountId,
                type: LineType.DEBIT,
                amount: bill.total,
                currency: bill.currency,
              },
              {
                subtype: AccountSubtype.BANK,
                fallbackSubtype: AccountSubtype.CASH,
                accountNodeId: data.accountNodeId,
                type: LineType.CREDIT,
                amount: bill.total,
                currency: bill.currency,
              },
            ],
            logger,
          },
          tx,
        );
        if (!journalEntryId) {
          return fail({
            message: t("post.errors.paymentPosting"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        await tx
          .update(paymentBills)
          .set({ status: BillStatus.PAID, paidAt, updatedAt: new Date() })
          .where(eq(paymentBills.id, bill.id));

        logger.info("AP bill marked as paid", {
          billId: bill.id,
          journalEntryId,
          paidAt,
        });

        return success({ status: BillStatus.PAID, paidAtResponse: paidAt });
      });
    } catch (error) {
      logger.error("Failed to pay AP bill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
