/**
 * Chart of Accounts — Journal Entry Get Repository
 * Retrieves a single journal entry with all its lines
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";

import { accountNodes, journalEntries, journalEntryLines } from "../../../db";
import { JournalEntryStatus, JournalSourceType } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { CoaJournalEntryGetResponseOutput } from "./definition";

function supplierPostingKind(
  sourceType: string,
): "approval" | "settlement" | undefined {
  if (sourceType === JournalSourceType.AP_BILL || sourceType === "AP_BILL") {
    return "approval";
  }
  if (
    sourceType === JournalSourceType.AP_PAYMENT ||
    sourceType === "AP_PAYMENT"
  ) {
    return "settlement";
  }
  return undefined;
}

export class CoaJournalEntryGetRepository {
  static async getEntry(
    entryId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CoaJournalEntryGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [entry] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, entryId))
        .limit(1);

      if (!entry) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Verify company membership
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        entry.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );

      if (!authResult.success) {
        return authResult;
      }

      const supplierPosting = supplierPostingKind(entry.sourceType);
      const sourceBillId = entry.sourceId;
      const [sourceBill] =
        supplierPosting &&
        sourceBillId &&
        !entry.reversalOfId &&
        (entry.status === JournalEntryStatus.POSTED ||
          entry.status === JournalEntryStatus.REVERSED) &&
        (await getDocumentAccess(userId, { companyId: entry.companyId }))
          ? await db
              .select({
                id: paymentBills.id,
                number: paymentBills.billNumber,
                supplierName: paymentBills.supplierName,
              })
              .from(paymentBills)
              .where(
                and(
                  eq(paymentBills.id, sourceBillId),
                  eq(paymentBills.companyId, entry.companyId),
                  supplierPosting === "approval"
                    ? eq(paymentBills.journalEntryId, entry.id)
                    : eq(paymentBills.status, BillStatus.PAID),
                ),
              )
              .limit(1)
          : [];

      const linkedIds = [entry.reversalOfId, entry.reversedById].filter(
        (id): id is string => Boolean(id) && id !== entry.id,
      );
      const linkedRows = linkedIds.length
        ? await db
            .select({
              id: journalEntries.id,
              entryNumber: journalEntries.entryNumber,
              reversalOfId: journalEntries.reversalOfId,
              reversedById: journalEntries.reversedById,
            })
            .from(journalEntries)
            .where(
              and(
                eq(journalEntries.companyId, entry.companyId),
                inArray(journalEntries.id, linkedIds),
              ),
            )
        : [];
      const linkedEntries: NonNullable<
        CoaJournalEntryGetResponseOutput["result"]["linkedEntries"]
      > = [];
      for (const linked of linkedRows) {
        if (
          linked.id === entry.reversalOfId &&
          linked.reversedById === entry.id
        ) {
          linkedEntries.push({
            id: linked.id,
            entryNumber: linked.entryNumber,
            relation: "original",
          });
        }
        if (
          linked.id === entry.reversedById &&
          linked.reversalOfId === entry.id
        ) {
          linkedEntries.push({
            id: linked.id,
            entryNumber: linked.entryNumber,
            relation: "reversal",
          });
        }
      }

      const lines = await db
        .select({
          lineId: journalEntryLines.id,
          accountId: journalEntryLines.accountId,
          accountCode: accountNodes.code,
          accountName: accountNodes.name,
          lineType: journalEntryLines.type,
          amount: journalEntryLines.amount,
          currency: journalEntryLines.currency,
          lineDescription: journalEntryLines.description,
        })
        .from(journalEntryLines)
        .leftJoin(
          accountNodes,
          and(
            eq(accountNodes.id, journalEntryLines.accountId),
            eq(accountNodes.companyId, entry.companyId),
          ),
        )
        .where(eq(journalEntryLines.journalEntryId, entryId))
        .orderBy(journalEntryLines.sortOrder);

      return success({
        result: {
          id: entry.id,
          companyId: entry.companyId,
          periodId: entry.periodId,
          entryNumber: entry.entryNumber,
          date: entry.date,
          description: entry.description,
          memo: entry.memo ?? null,
          status: entry.status,
          sourceType: entry.sourceType,
          sourceId: supplierPosting
            ? (sourceBill?.id ?? null)
            : (entry.sourceId ?? null),
          supplierBill:
            sourceBill && supplierPosting
              ? {
                  ...sourceBill,
                  posting: supplierPosting,
                  systemDescription:
                    entry.description ===
                    `${supplierPosting === "approval" ? "AP bill" : "AP payment"}: ${sourceBill.supplierName}`,
                }
              : undefined,
          postedAt: entry.postedAt ?? null,
          reversalOfId:
            linkedEntries.find((link) => link.relation === "original")?.id ??
            null,
          linkedEntries,
          lines,
        },
      });
    } catch (error) {
      logger.error("Error getting journal entry", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
