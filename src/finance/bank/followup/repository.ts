import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
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
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
} from "@/chart-of-accounts/enum";
import { writeJournalReversal } from "@/chart-of-accounts/shared/ledger-reversal";
import {
  findOpenPeriod,
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { billDueDateFromTerms } from "@/payment/bill/create/dates";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { purchasingVendors } from "@/purchasing/db";

import { bankStatementLines } from "../db";
import { type BankT, scopedTranslation } from "../i18n";
import { bankUnits } from "../reconciliation-plan";
import { hasSupplierBillCandidate } from "./bill-provenance";
import type { BankFollowupInput, BankFollowupOutput } from "./definition";

export class BankFollowupRepository {
  static async run(
    data: BankFollowupInput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankFollowupOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!data.confirm) {
      return fail({
        message: t("check.confirmation"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      return await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, data.companyId);
        const access = await getDocumentAccess(
          userId,
          { companyId: data.companyId },
          tx,
        );
        if (!company || !access?.canManage) {
          return fail({
            message: t("errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const [statement] = await tx
          .select()
          .from(bankStatementLines)
          .where(
            and(
              eq(bankStatementLines.id, data.lineId),
              eq(bankStatementLines.companyId, data.companyId),
            ),
          )
          .for("update");
        if (!statement) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return data.action === "release"
          ? BankFollowupRepository.release(tx, statement, data, userId, t)
          : BankFollowupRepository.createDraft(tx, statement, data, t);
      });
    } catch (error) {
      logger.error("Bank follow-up failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async release(
    tx: LedgerTransaction,
    statement: typeof bankStatementLines.$inferSelect,
    data: BankFollowupInput,
    userId: string,
    t: BankT,
  ): Promise<ResponseType<BankFollowupOutput>> {
    if (!statement.matchedJournalLineId) {
      return success({
        released: true,
        billId: null,
        reversalId: statement.adjustmentReversalEntryId,
      });
    }
    if (
      data.expectedJournalLineId !== statement.matchedJournalLineId ||
      !statement.matchedAt ||
      data.expectedMatchedAt !== statement.matchedAt.toISOString() ||
      !data.reason
    ) {
      return fail({
        message: t("errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    let reversalId = statement.adjustmentReversalEntryId;
    if (statement.adjustmentJournalEntryId) {
      const reversalDate = data.reverseDate ? new Date(data.reverseDate) : null;
      const [entry] = await tx
        .select()
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.id, statement.adjustmentJournalEntryId),
            eq(journalEntries.companyId, statement.companyId),
            eq(journalEntries.sourceId, statement.id),
            eq(
              journalEntries.sourceType,
              JournalSourceType.BANK_RECONCILIATION,
            ),
            eq(journalEntries.status, JournalEntryStatus.POSTED),
          ),
        )
        .for("update");
      const period =
        reversalDate &&
        (await findOpenPeriod(tx, statement.companyId, reversalDate));
      if (!entry || !period || !reversalDate || reversalDate < entry.date) {
        return fail({
          message: t("adjustment.unavailable"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const lines = await tx
        .select()
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, entry.id))
        .orderBy(journalEntryLines.sortOrder, journalEntryLines.id);
      if (lines.length < 2) {
        return fail({
          message: t("adjustment.unavailable"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const reversal = await writeJournalReversal(tx, entry, lines, {
        periodId: period.id,
        date: reversalDate,
        userId,
        memo: data.reason,
      });
      if (!reversal) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      reversalId = reversal.id;
    }

    await tx
      .update(bankStatementLines)
      .set({
        matchedJournalLineId: null,
        matchedAt: null,
        matchedByUserId: null,
        matchKind: null,
        adjustmentJournalEntryId: null,
        adjustmentReversalEntryId: reversalId,
      })
      .where(eq(bankStatementLines.id, statement.id));
    return success({ released: true, billId: null, reversalId });
  }

  private static async createDraft(
    tx: LedgerTransaction,
    statement: typeof bankStatementLines.$inferSelect,
    data: BankFollowupInput,
    t: BankT,
  ): Promise<ResponseType<BankFollowupOutput>> {
    const { vendorId, expenseAccountId } = data;
    const units = bankUnits(statement.nativeAmount ?? statement.amount);
    const currency = z
      .enum(CurrenciesArr)
      .safeParse(statement.nativeCurrency ?? statement.currency);
    if (
      !vendorId ||
      !expenseAccountId ||
      units === null ||
      units >= BigInt(0) ||
      !currency.success
    ) {
      return fail({
        message: t("check.row", { row: 0 }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    if (statement.supplierBillId) {
      const [prior] = await tx
        .select({ metadata: paymentBills.metadata })
        .from(paymentBills)
        .where(
          and(
            eq(paymentBills.id, statement.supplierBillId),
            eq(paymentBills.companyId, statement.companyId),
          ),
        );
      const provenance = z
        .object({ vendorId: z.uuid(), expenseAccountId: z.uuid() })
        .safeParse(prior?.metadata);
      return provenance.success &&
        provenance.data.vendorId === vendorId &&
        provenance.data.expenseAccountId === expenseAccountId
        ? success({
            released: false,
            billId: statement.supplierBillId,
            reversalId: null,
          })
        : fail({
            message: t("errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
    }
    if (statement.matchedJournalLineId) {
      return fail({
        message: t("ui.alreadyMatched"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    const [vendor] = await tx
      .select()
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.id, vendorId),
          eq(purchasingVendors.companyId, statement.companyId),
          eq(purchasingVendors.isActive, true),
        ),
      )
      .for("share");
    const [expense] = await tx
      .select({ id: accountNodes.id })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.id, expenseAccountId),
          eq(accountNodes.companyId, statement.companyId),
          eq(accountNodes.type, AccountType.EXPENSE),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .for("share");
    if (!vendor || !expense) {
      return fail({
        message: t("adjustment.invalidSettings"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const gross = Number(-units) / 10_000;
    if (gross >= 100_000_000) {
      return fail({
        message: t("check.row", { row: 0 }),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const billDate = new Date(statement.bookedDate);
    const facts = {
      companyId: statement.companyId,
      vendorId,
      supplierName: vendor.name,
      currency: currency.data,
      total: gross,
      date: billDate,
    };
    if (
      (await hasSupplierBillCandidate(
        tx,
        { ...facts, maxDateDistance: 0 },
        "numbered-document",
      )) ||
      (await hasSupplierBillCandidate(
        tx,
        { ...facts, maxDateDistance: 7 },
        "mailbox-tax-pending",
      ))
    ) {
      return fail({
        message: t("statement.overlap"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    const billId = randomUUID();
    const note = t("adjustment.sourceMemo", {
      reference: statement.transactionId,
    });
    await tx.insert(paymentBills).values({
      id: billId,
      companyId: statement.companyId,
      supplierName: vendor.name,
      supplierVatNumber: vendor.vatNumber,
      billNumber: null,
      billDate,
      dueDate:
        billDueDateFromTerms(billDate, vendor.defaultPaymentTermsDays) ?? null,
      currency: currency.data,
      subtotal: gross,
      taxAmount: 0,
      total: gross,
      notes: note,
      metadata: {
        vendorId,
        expenseAccountId,
        bankStatementLineId: statement.id,
        bankSourceReference: statement.transactionId,
        originalSupplierInvoicePending: true,
      },
    });
    await tx.insert(paymentBillLines).values({
      billId,
      description: statement.description || note,
      quantity: 1,
      unitPrice: gross,
      lineTotal: gross,
      taxAmount: 0,
      taxRate: 0,
      expenseAccountId,
    });
    await tx
      .update(bankStatementLines)
      .set({ supplierBillId: billId })
      .where(eq(bankStatementLines.id, statement.id));
    return success({ released: false, billId, reversalId: null });
  }
}
