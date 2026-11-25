import "server-only";

import {
  and,
  asc,
  count,
  eq,
  gt,
  inArray,
  isNull,
  type SQL,
  sql,
} from "drizzle-orm";
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
  LineType,
} from "@/chart-of-accounts/enum";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { canManageCompanyDocuments } from "@/finance/document-company-scope";
import { documentPage } from "@/finance/document-list";

import type {
  BankCandidatesPath,
  BankCandidatesRequest,
  BankCandidatesResponse,
} from "./candidates/definition";
import { parseBankStatementCsv } from "./csv";
import { bankStatementLines } from "./db";
import { scopedTranslation } from "./i18n";
import type {
  BankImportRequest,
  BankImportResponse,
} from "./import/definition";
import type { BankListRequest, BankListResponse } from "./list/definition";
import type {
  BankMatchPath,
  BankMatchRequest,
  BankMatchResponse,
} from "./match/definition";

export class BankReconciliationRepository {
  private static readonly pageSize = 25;

  static async importStatement(
    userId: string,
    data: BankImportRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankImportResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const parsed = parseBankStatementCsv(data.csv);
    if (!parsed.success) {
      return fail({
        message: t(`check.${parsed.error}`, { row: parsed.row ?? 0 }),
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
        const account = await BankReconciliationRepository.getBankAccount(
          tx,
          data.companyId,
          data.accountId,
          true,
        );
        if (!company || !account) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (
          parsed.rows.some(
            ({ currency }) => currency !== (company.currency ?? "EUR"),
          )
        ) {
          return fail({
            message: t("check.currency"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const storedRows = await tx
          .select({
            transactionId: bankStatementLines.transactionId,
            bookedDate: bankStatementLines.bookedDate,
            amount: bankStatementLines.amount,
            currency: bankStatementLines.currency,
          })
          .from(bankStatementLines)
          .where(
            and(
              eq(bankStatementLines.companyId, data.companyId),
              eq(bankStatementLines.accountId, data.accountId),
              inArray(
                bankStatementLines.transactionId,
                parsed.rows.map(({ transactionId }) => transactionId),
              ),
            ),
          );
        const storedByTransaction = new Map(
          storedRows.map((row) => [row.transactionId, row]),
        );
        const newRows: typeof parsed.rows = [];
        for (const row of parsed.rows) {
          const stored = storedByTransaction.get(row.transactionId);
          if (!stored) {
            newRows.push(row);
            continue;
          }
          if (
            stored.bookedDate !== row.bookedDate ||
            stored.amount !== row.amount ||
            stored.currency !== row.currency
          ) {
            return fail({
              message: t("check.storedDuplicate"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
        }
        if (newRows.length > 0) {
          await tx.insert(bankStatementLines).values(
            newRows.map((row) => ({
              ...row,
              companyId: data.companyId,
              accountId: data.accountId,
              importedByUserId: userId,
            })),
          );
        }

        return success({
          imported: newRows.length,
          skipped:
            parsed.rows.length - newRows.length + parsed.skippedDuplicateRows,
          selectedCompanyId: data.companyId,
          selectedAccountId: data.accountId,
        });
      });
    } catch (error) {
      logger.error("Bank CSV import failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async listOpen(
    userId: string,
    data: BankListRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankListResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (!data.companyId || !data.accountId) {
      return success({
        lines: [],
        total: 0,
        currentPage: 1,
        pageCount: 1,
        selectedCompanyId: data.companyId ?? null,
        selectedAccountId: null,
        selectedAccountName: null,
        selectedCompanyName: null,
      });
    }
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.VIEWER,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }

    try {
      const account = await BankReconciliationRepository.getBankAccount(
        db,
        data.companyId,
        data.accountId,
        false,
      );
      if (!account) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const where = and(
        eq(bankStatementLines.companyId, data.companyId),
        eq(bankStatementLines.accountId, data.accountId),
        isNull(bankStatementLines.matchedJournalLineId),
      );
      const [{ total }] = await db
        .select({ total: count() })
        .from(bankStatementLines)
        .where(where);
      const pageSize = BankReconciliationRepository.pageSize;
      const pagination = documentPage(total, data.page, pageSize);
      const lines = await db
        .select({
          id: bankStatementLines.id,
          transactionId: bankStatementLines.transactionId,
          bookedDate: bankStatementLines.bookedDate,
          amount: bankStatementLines.amount,
          currency: bankStatementLines.currency,
        })
        .from(bankStatementLines)
        .where(where)
        .orderBy(asc(bankStatementLines.bookedDate), asc(bankStatementLines.id))
        .limit(pageSize)
        .offset((pagination.currentPage - 1) * pageSize);
      return success({
        lines,
        total,
        currentPage: pagination.currentPage,
        pageCount: pagination.pageCount,
        selectedCompanyId: data.companyId,
        selectedAccountId: data.accountId,
        selectedAccountName: account.name,
        selectedCurrency: account.currency ?? "EUR",
        selectedCompanyName: account.companyName,
      });
    } catch (error) {
      logger.error("Bank line listing failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async findCandidates(
    userId: string,
    data: BankCandidatesRequest,
    path: BankCandidatesPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankCandidatesResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.VIEWER,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }

    try {
      const [line] = await db
        .select()
        .from(bankStatementLines)
        .where(
          and(
            eq(bankStatementLines.id, path.lineId),
            eq(bankStatementLines.companyId, data.companyId),
          ),
        )
        .limit(1);
      if (
        !line ||
        !(await BankReconciliationRepository.getBankAccount(
          db,
          data.companyId,
          line.accountId,
          false,
        ))
      ) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const matches = line.matchedJournalLineId
        ? []
        : await db
            .select({
              id: journalEntryLines.id,
              entryNumber: journalEntries.entryNumber,
              description: sql<string>`coalesce(${journalEntryLines.description}, ${journalEntries.description})`,
              journalDate: journalEntries.date,
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
            .where(
              and(
                BankReconciliationRepository.matchingCriteria(line),
                isNull(bankStatementLines.id),
              ),
            )
            .orderBy(
              sql`abs(${journalEntries.date}::date - ${line.bookedDate}::date)`,
              asc(journalEntries.date),
              asc(journalEntryLines.id),
            )
            .limit(50);

      return success({
        statementLine: {
          id: line.id,
          transactionId: line.transactionId,
          bookedDate: line.bookedDate,
          amount: line.amount,
          currency: line.currency,
        },
        matches,
        selectedCompanyId: line.companyId,
        matchedJournalLineId: line.matchedJournalLineId,
        canMatch: canManageCompanyDocuments(auth.data.role),
      });
    } catch (error) {
      logger.error("Bank match candidates failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async match(
    userId: string,
    data: BankMatchRequest,
    path: BankMatchPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankMatchResponse>> {
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
        const [line] = await tx
          .select()
          .from(bankStatementLines)
          .where(
            and(
              eq(bankStatementLines.id, path.lineId),
              eq(bankStatementLines.companyId, data.companyId),
            ),
          )
          .limit(1)
          .for("update");
        if (
          !company ||
          !line ||
          !(await BankReconciliationRepository.getBankAccount(
            tx,
            data.companyId,
            line.accountId,
            true,
          ))
        ) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (
          line.matchedJournalLineId === data.journalLineId &&
          line.matchedAt
        ) {
          return success({
            matchedJournalLineId: line.matchedJournalLineId,
            selectedAccountId: line.accountId,
            matchedAt: line.matchedAt,
          });
        }
        if (line.matchedJournalLineId) {
          return fail({
            message: t("ui.alreadyMatched"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [candidate] = await tx
          .select({ id: journalEntryLines.id })
          .from(journalEntryLines)
          .innerJoin(
            journalEntries,
            eq(journalEntries.id, journalEntryLines.journalEntryId),
          )
          .where(
            and(
              eq(journalEntryLines.id, data.journalLineId),
              BankReconciliationRepository.matchingCriteria(line),
            ),
          )
          .limit(1)
          .for("share");
        if (!candidate) {
          return fail({
            message: t("check.journalMatch"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const [alreadyMatched] = await tx
          .select({ id: bankStatementLines.id })
          .from(bankStatementLines)
          .where(
            eq(bankStatementLines.matchedJournalLineId, data.journalLineId),
          )
          .limit(1);
        if (alreadyMatched) {
          return fail({
            message: t("check.journalTaken"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const matchedAt = new Date();
        await tx
          .update(bankStatementLines)
          .set({
            matchedAt,
            matchedByUserId: userId,
            matchedJournalLineId: candidate.id,
          })
          .where(eq(bankStatementLines.id, line.id));
        return success({
          matchedJournalLineId: candidate.id,
          selectedAccountId: line.accountId,
          matchedAt,
        });
      });
    } catch (error) {
      logger.error("Bank match confirmation failed", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async getBankAccount(
    client: Pick<typeof db, "select">,
    companyId: string,
    accountId: string,
    lock: boolean,
  ): Promise<
    { name: string; companyName: string; currency: string | null } | undefined
  > {
    const query = client
      .select({
        name: accountNodes.name,
        companyName: companies.name,
        currency: companies.currency,
      })
      .from(accountNodes)
      .innerJoin(companies, eq(companies.id, accountNodes.companyId))
      .where(
        and(
          eq(companies.isActive, true),
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.id, accountId),
          eq(accountNodes.subtype, AccountSubtype.BANK),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .limit(1);
    const [account] = lock ? await query.for("share") : await query;
    return account;
  }

  private static matchingCriteria(
    bankLine: Pick<
      typeof bankStatementLines.$inferSelect,
      "companyId" | "accountId" | "amount" | "currency"
    >,
  ): SQL | undefined {
    return and(
      eq(journalEntries.companyId, bankLine.companyId),
      eq(journalEntries.status, JournalEntryStatus.POSTED),
      isNull(journalEntries.reversedById),
      eq(journalEntryLines.accountId, bankLine.accountId),
      eq(journalEntryLines.currency, bankLine.currency),
      inArray(journalEntryLines.type, [LineType.DEBIT, LineType.CREDIT]),
      gt(journalEntryLines.amount, 0),
      sql`(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end) = ${bankLine.amount}::numeric`,
    );
  }
}
