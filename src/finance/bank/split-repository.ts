import "server-only";

import { and, eq, inArray, isNull, ne } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
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
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import { bankStatementLines, bankStatementLineSplits } from "./db";
import { scopedTranslation } from "./i18n";
import { bankUnits } from "./reconciliation-plan";
import type { BankSplitRequest, BankSplitResponse } from "./split/definition";

export class BankSplitRepository {
  static async applySplit(
    userId: string,
    data: BankSplitRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankSplitResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!data.confirm) {
      return fail({
        message: t("check.confirmation"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
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

        const [line] = await tx
          .select()
          .from(bankStatementLines)
          .where(
            and(
              eq(bankStatementLines.id, data.lineId),
              eq(bankStatementLines.companyId, data.companyId),
            ),
          )
          .limit(1)
          .for("update");
        if (!line) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (line.matchedJournalLineId || line.matchedAt) {
          return fail({
            message: t("ui.alreadyMatched"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const lineUnits = bankUnits(line.amount);
        if (!lineUnits || lineUnits === BigInt(0)) {
          return fail({
            message: t("check.splitTotalMismatch"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        let allocatedUnits = BigInt(0);
        const parsedAllocations: Array<{
          targetType: "journal_line" | "invoice" | "bill" | "account";
          targetId: string;
          units: bigint;
          amount: string;
          description?: string;
        }> = [];

        for (const item of data.allocations) {
          const units = bankUnits(item.amount);
          if (!units || units === BigInt(0)) {
            return fail({
              message: t("check.splitTotalMismatch"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          allocatedUnits += units;
          parsedAllocations.push({
            targetType: item.targetType,
            targetId: item.targetId,
            units,
            amount: item.amount,
            description: item.description,
          });
        }

        if (allocatedUnits !== lineUnits) {
          return fail({
            message: t("check.splitTotalMismatch"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const journalAllocations = parsedAllocations.filter(
          (a) => a.targetType === "journal_line",
        );
        const postingAllocations = parsedAllocations.filter(
          (a) => a.targetType !== "journal_line",
        );

        // Validate existing journal line allocations
        if (journalAllocations.length > 0) {
          const jIds = journalAllocations.map((a) => a.targetId);
          if (new Set(jIds).size !== jIds.length) {
            return fail({
              message: t("check.journalTaken"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          const rows = await tx
            .select({
              id: journalEntryLines.id,
              sign: journalEntryLines.type,
              amount: journalEntryLines.amount,
              matchedMainId: bankStatementLines.id,
              matchedSplitId: bankStatementLineSplits.id,
            })
            .from(journalEntryLines)
            .innerJoin(
              journalEntries,
              eq(journalEntries.id, journalEntryLines.journalEntryId),
            )
            .leftJoin(
              bankStatementLines,
              eq(bankStatementLines.matchedJournalLineId, journalEntryLines.id),
            )
            .leftJoin(
              bankStatementLineSplits,
              eq(bankStatementLineSplits.journalLineId, journalEntryLines.id),
            )
            .where(
              and(
                inArray(journalEntryLines.id, jIds),
                eq(journalEntries.companyId, data.companyId),
                eq(journalEntries.status, JournalEntryStatus.POSTED),
                ne(
                  journalEntries.sourceType,
                  JournalSourceType.BANK_RECONCILIATION,
                ),
                isNull(journalEntries.reversedById),
                eq(journalEntryLines.accountId, line.accountId),
                eq(journalEntryLines.currency, line.currency),
              ),
            );
          if (rows.length !== jIds.length) {
            return fail({
              message: t("check.journalMatch"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          for (const alloc of journalAllocations) {
            const matchRow = rows.find((r) => r.id === alloc.targetId);
            if (
              !matchRow ||
              matchRow.matchedMainId ||
              matchRow.matchedSplitId
            ) {
              return fail({
                message: t("check.journalTaken"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
            const signed = `${matchRow.sign === LineType.CREDIT ? "-" : ""}${matchRow.amount.toFixed(4)}`;
            if (bankUnits(signed) !== alloc.units) {
              return fail({
                message: t("check.journalMatch"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
          }
        }

        // Build consolidated journal entry for invoice / bill / account allocations
        let createdJournalEntryId: string | null = null;
        let createdBankLegId: string | null = null;
        const settledInvoices: Array<{ id: string; markPaid: boolean }> = [];
        const settledBills: Array<{ id: string; markPaid: boolean }> = [];

        if (postingAllocations.length > 0) {
          let bankPostingUnits = BigInt(0);
          const counterLines: AutoPostLine[] = [];

          for (const alloc of postingAllocations) {
            bankPostingUnits += alloc.units;
            const absAmount = Math.abs(Number(alloc.units)) / 10_000;

            if (alloc.targetType === "invoice") {
              const balanceParts = getInvoiceOpenBalanceParts(
                tx,
                data.companyId,
                line.currency,
              );
              const [invRow] = await tx
                .select({
                  invoice: paymentInvoices,
                  openAmount: balanceParts.openAmount,
                })
                .from(paymentInvoices)
                .leftJoin(balanceParts.payments, balanceParts.paymentJoin)
                .leftJoin(balanceParts.credits, balanceParts.creditJoin)
                .where(
                  and(
                    eq(paymentInvoices.id, alloc.targetId),
                    eq(paymentInvoices.companyId, data.companyId),
                    eq(paymentInvoices.status, InvoiceStatus.OPEN),
                  ),
                )
                .limit(1);
              const inv = invRow?.invoice;
              if (
                !inv ||
                inv.currency !== line.currency ||
                alloc.units <= BigInt(0)
              ) {
                return fail({
                  message: t("check.splitTargetInvalid"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              const openCents = Math.round(Number(invRow.openAmount) * 100);
              const allocCents = Number(alloc.units / BigInt(100));
              if (allocCents > openCents) {
                return fail({
                  message: t("check.splitTargetInvalid"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              counterLines.push({
                subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
                type: LineType.CREDIT,
                amount: absAmount,
                currency: line.currency,
                description:
                  alloc.description ??
                  `AR receipt ${inv.invoiceNumber ?? inv.providerInvoiceId}`,
              });
              settledInvoices.push({
                id: inv.id,
                markPaid: allocCents === openCents,
              });
            } else if (alloc.targetType === "bill") {
              const [bill] = await tx
                .select()
                .from(paymentBills)
                .where(
                  and(
                    eq(paymentBills.id, alloc.targetId),
                    eq(paymentBills.companyId, data.companyId),
                    inArray(paymentBills.status, [
                      BillStatus.RECEIVED,
                      BillStatus.APPROVED,
                    ]),
                  ),
                )
                .limit(1)
                .for("update");
              if (
                !bill ||
                bill.currency !== line.currency ||
                alloc.units >= BigInt(0)
              ) {
                return fail({
                  message: t("check.splitTargetInvalid"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              const billUnitsVal = BigInt(Math.round(bill.total * 10_000));
              if (-alloc.units > billUnitsVal) {
                return fail({
                  message: t("check.splitTargetInvalid"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              counterLines.push({
                subtype: AccountSubtype.ACCOUNTS_PAYABLE,
                type: LineType.DEBIT,
                amount: absAmount,
                currency: line.currency,
                description:
                  alloc.description ?? `AP payment ${bill.billNumber}`,
              });
              settledBills.push({
                id: bill.id,
                markPaid: -alloc.units === billUnitsVal,
              });
            } else if (alloc.targetType === "account") {
              const [acct] = await tx
                .select()
                .from(accountNodes)
                .where(
                  and(
                    eq(accountNodes.id, alloc.targetId),
                    eq(accountNodes.companyId, data.companyId),
                    eq(accountNodes.isActive, true),
                    eq(accountNodes.isPostable, true),
                  ),
                )
                .limit(1);
              if (!acct || acct.id === line.accountId) {
                return fail({
                  message: t("check.splitTargetInvalid"),
                  errorType: ErrorResponseTypes.VALIDATION_ERROR,
                });
              }
              counterLines.push({
                accountNodeId: acct.id,
                subtype: acct.subtype,
                type:
                  alloc.units > BigInt(0) ? LineType.CREDIT : LineType.DEBIT,
                amount: absAmount,
                currency: line.currency,
                description: alloc.description ?? acct.name,
              });
            }
          }

          if (bankPostingUnits !== BigInt(0)) {
            const journalLines: AutoPostLine[] = [
              {
                accountNodeId: line.accountId,
                subtype: AccountSubtype.BANK,
                type:
                  bankPostingUnits > BigInt(0)
                    ? LineType.DEBIT
                    : LineType.CREDIT,
                amount: Math.abs(Number(bankPostingUnits)) / 10_000,
                currency: line.currency,
                description: `Bank split ${line.transactionId}`,
              },
              ...counterLines,
            ];

            createdJournalEntryId = await postJournalEntry(
              {
                companyId: data.companyId,
                date: new Date(`${line.bookedDate}T00:00:00Z`),
                description: `Bank split reconciliation: ${line.transactionId}`,
                sourceType: JournalSourceType.BANK_RECONCILIATION,
                sourceId: line.id,
                postedByUserId: userId,
                lines: journalLines,
                logger,
              },
              tx,
            );
            if (!createdJournalEntryId) {
              return fail({
                message: t("adjustment.unavailable"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              });
            }
            const [bankLeg] = await tx
              .select({ id: journalEntryLines.id })
              .from(journalEntryLines)
              .where(
                and(
                  eq(journalEntryLines.journalEntryId, createdJournalEntryId),
                  eq(journalEntryLines.accountId, line.accountId),
                ),
              )
              .limit(1);
            createdBankLegId = bankLeg?.id ?? null;
          }
        }

        // Mark settled invoices and bills paid
        const bookedDateObj = new Date(`${line.bookedDate}T00:00:00Z`);
        for (const inv of settledInvoices) {
          if (inv.markPaid) {
            await tx
              .update(paymentInvoices)
              .set({
                status: InvoiceStatus.PAID,
                paidAt: bookedDateObj,
                updatedAt: new Date(),
              })
              .where(eq(paymentInvoices.id, inv.id));
          }
        }
        for (const bill of settledBills) {
          if (bill.markPaid) {
            await tx
              .update(paymentBills)
              .set({
                status: BillStatus.PAID,
                paidAt: bookedDateObj,
                updatedAt: new Date(),
              })
              .where(eq(paymentBills.id, bill.id));
          }
        }

        // Persist split rows
        await tx.insert(bankStatementLineSplits).values(
          parsedAllocations.map((alloc) => ({
            bankStatementLineId: line.id,
            companyId: data.companyId,
            targetType: alloc.targetType,
            journalLineId:
              alloc.targetType === "journal_line" ? alloc.targetId : null,
            invoiceId: alloc.targetType === "invoice" ? alloc.targetId : null,
            billId: alloc.targetType === "bill" ? alloc.targetId : null,
            accountId: alloc.targetType === "account" ? alloc.targetId : null,
            amount: alloc.amount,
            description: alloc.description ?? null,
            createdJournalEntryId:
              alloc.targetType === "journal_line"
                ? null
                : createdJournalEntryId,
            createdByUserId: userId,
          })),
        );

        const matchedAt = new Date();
        const primaryMatchedLeg =
          journalAllocations.length === 0
            ? createdBankLegId
            : journalAllocations.length === 1 && postingAllocations.length === 0
              ? journalAllocations[0].targetId
              : null;

        await tx
          .update(bankStatementLines)
          .set({
            matchedAt,
            matchedByUserId: userId,
            matchedJournalLineId: primaryMatchedLeg,
            adjustmentJournalEntryId:
              createdJournalEntryId && primaryMatchedLeg === null
                ? createdJournalEntryId
                : null,
            matchKind: "split",
          })
          .where(eq(bankStatementLines.id, line.id));

        return success({
          selectedAccountId: line.accountId,
          splitCount: parsedAllocations.length,
          createdJournalEntryId,
          matchedAt,
        });
      });
    } catch (error) {
      logger.error("Bank split match failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
