import "server-only";

import {
  and,
  asc,
  count,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  ne,
  or,
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
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { screenBankFileRows } from "@/finance/bank-connections/privacy/repository";
import {
  canManageCompanyDocuments,
  getDocumentAccess,
} from "@/finance/document-company-scope";
import { documentPage } from "@/finance/document-list";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { postBankAdjustment } from "./adjustment";
import type {
  BankCandidatesPath,
  BankCandidatesRequest,
  BankCandidatesResponse,
} from "./candidates/definition";
import { bankAccountReconciliationSettings, bankStatementLines } from "./db";
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
import { getBankPaymentBasis } from "./payment-basis";
import { bankUnits, planBankMatch } from "./reconciliation-plan";
import { parseStatementFile } from "./statement-file";
import {
  type NormalizedBankImport,
  normalizedStatementRowsSchema,
  type PreparedBankImport,
} from "./statement-format";
import { keyStatementRows } from "./statement-identity";

export class BankReconciliationRepository {
  private static readonly pageSize = 25;

  static async importStatement(
    userId: string,
    data: BankImportRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankImportResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
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
      const format = data.format ?? "normalized";
      const parsed = parseStatementFile(
        data.csv,
        format,
        data.fileOptions,
        account.currency ?? "EUR",
      );
      if (!parsed.success) {
        return fail({
          message: t(`check.${parsed.error}`, { row: parsed.row ?? 0 }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (!normalizedStatementRowsSchema.safeParse(parsed.rows).success) {
        return fail({
          message: t("check.row", { row: 0 }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const screened = await screenBankFileRows(
        {
          companyId: data.companyId,
          accountId: data.accountId,
          actorId: userId,
          rows: parsed.rows,
          dryRun: data.dryRun ?? false,
        },
        logger,
        locale,
      );
      if (!screened.success) {
        return screened;
      }
      if (screened.data.rows.length === 0) {
        return success({
          imported: 0,
          autoMatched: data.autoMatch ? 0 : undefined,
          skipped: parsed.skippedDuplicateRows ?? 0,
          screenedOut: screened.data.rejectedOrUnknownCount ?? 0,
          preview: data.dryRun ?? false,
          selectedCompanyId: data.companyId,
          selectedAccountId: data.accountId,
        });
      }
      return BankReconciliationRepository.persistStatement(
        userId,
        {
          companyId: data.companyId,
          accountId: data.accountId,
          format,
          feedIdentifier: screened.data.feedIdentifier,
          rows: screened.data.rows,
          screenedOut: screened.data.rejectedOrUnknownCount,
          skipped: parsed.skippedDuplicateRows ?? 0,
          dryRun: data.dryRun ?? false,
          autoMatch: data.autoMatch,
        },
        logger,
        locale,
      );
    } catch {
      logger.error("Bank statement preparation failed");
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async importNormalizedStatement(
    userId: string,
    data: NormalizedBankImport,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankImportResponse>> {
    return BankReconciliationRepository.persistStatement(
      userId,
      { ...data, format: "api", skipped: 0 },
      logger,
      locale,
    );
  }

  private static async persistStatement(
    userId: string,
    data: PreparedBankImport,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankImportResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
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
        if (!access?.canManage) {
          return fail({
            message: t("errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
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
        const { format, feedIdentifier } = data;
        const normalized = normalizedStatementRowsSchema.safeParse(data.rows);
        if (
          !normalized.success ||
          (feedIdentifier && !/^[A-Za-z0-9._:-]{1,128}$/u.test(feedIdentifier))
        ) {
          return fail({
            message: t("check.row", { row: 0 }),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const keyed = keyStatementRows(normalized.data);
        if (!keyed.success) {
          return fail({
            message: t("check.duplicate", { row: keyed.index + 1 }),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        if (
          normalized.data.some(
            ({ currency }) => currency !== (account.currency ?? "EUR"),
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
            nativeAmount: bankStatementLines.nativeAmount,
            nativeCurrency: bankStatementLines.nativeCurrency,
            feeAmount: bankStatementLines.feeAmount,
            feeCurrency: bankStatementLines.feeCurrency,
            sourceFeed: bankStatementLines.sourceFeed,
            sourceFormat: bankStatementLines.sourceFormat,
            sourceReference: bankStatementLines.sourceReference,
            currency: bankStatementLines.currency,
          })
          .from(bankStatementLines)
          .where(
            and(
              eq(bankStatementLines.companyId, data.companyId),
              eq(bankStatementLines.accountId, data.accountId),
              or(
                inArray(
                  bankStatementLines.transactionId,
                  keyed.rows.map(({ transactionId }) => transactionId),
                ),
                and(
                  inArray(bankStatementLines.bookedDate, [
                    ...new Set(keyed.rows.map(({ bookedDate }) => bookedDate)),
                  ]),
                  inArray(bankStatementLines.amount, [
                    ...new Set(keyed.rows.map(({ amount }) => amount)),
                  ]),
                ),
              ),
            ),
          );
        const storedByTransaction = new Map(
          storedRows.map((row) => [row.transactionId, row]),
        );
        const newRows: typeof keyed.rows = [];
        for (const row of keyed.rows) {
          const stored = storedByTransaction.get(row.transactionId);
          if (!stored) {
            const feed = data.feedIdentifier;
            const overlap = storedRows.some(
              (candidate) =>
                candidate.bookedDate === row.bookedDate &&
                candidate.amount === row.amount &&
                candidate.currency === row.currency &&
                (!candidate.sourceReference ||
                  !row.sourceReference ||
                  candidate.sourceFeed !== feed ||
                  (candidate.sourceFormat ?? "normalized") !== format),
            );
            if (overlap) {
              return fail({
                message: t("statement.overlap"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
            newRows.push(row);
            continue;
          }
          if (
            stored.bookedDate !== row.bookedDate ||
            stored.amount !== row.amount ||
            stored.currency !== row.currency ||
            (stored.nativeAmount !== null &&
              row.nativeAmount &&
              stored.nativeAmount !== row.nativeAmount) ||
            (stored.nativeCurrency !== null &&
              row.nativeCurrency &&
              stored.nativeCurrency !== row.nativeCurrency) ||
            (stored.feeAmount !== null &&
              row.feeAmount &&
              stored.feeAmount !== row.feeAmount) ||
            (stored.feeCurrency !== null &&
              row.feeCurrency &&
              stored.feeCurrency !== row.feeCurrency)
          ) {
            return fail({
              message: t("check.storedDuplicate"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
        }
        if (!data.dryRun && newRows.length > 0) {
          await tx.insert(bankStatementLines).values(
            newRows.map((row) => ({
              ...row,
              sourceFormat: format,
              sourceFeed: feedIdentifier,
              companyId: data.companyId,
              accountId: data.accountId,
              importedByUserId: userId,
            })),
          );
        }

        const autoMatched =
          data.autoMatch && !data.dryRun
            ? await BankReconciliationRepository.matchSupplierPayments(tx, {
                companyId: data.companyId,
                accountId: data.accountId,
                userId,
                transactionIds: keyed.rows.map(
                  ({ transactionId }) => transactionId,
                ),
              })
            : data.autoMatch
              ? 0
              : undefined;

        return success({
          imported: newRows.length,
          autoMatched,
          skipped:
            keyed.rows.length - newRows.length + keyed.skipped + data.skipped,
          preview: data.dryRun === true,
          screenedOut: data.screenedOut,
          selectedCompanyId: data.companyId,
          selectedAccountId: data.accountId,
        });
      });
    } catch {
      logger.error("Bank statement import failed");
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
    const companyId = data.companyId;
    const empty = {
      lines: [],
      total: 0,
      currentPage: 1,
      pageCount: 1,
      selectedCompanyId: companyId ?? null,
      selectedAccountId: null,
      selectedAccountName: null,
      selectedCompanyName: null,
    };
    if (!companyId) {
      return success(empty);
    }
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      companyId,
      CompanyMemberRole.VIEWER,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }

    try {
      let accountId = data.accountId;
      if (!accountId) {
        const accounts = await db
          .select({ id: accountNodes.id })
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.companyId, companyId),
              eq(accountNodes.subtype, AccountSubtype.BANK),
              eq(accountNodes.isActive, true),
              eq(accountNodes.isPostable, true),
            ),
          )
          .limit(2);
        if (accounts.length !== 1) {
          return success(empty);
        }
        accountId = accounts[0].id;
      }
      const account = await BankReconciliationRepository.getBankAccount(
        db,
        companyId,
        accountId,
        false,
      );
      if (!account) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const where = and(
        eq(bankStatementLines.companyId, companyId),
        eq(bankStatementLines.accountId, accountId),
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
      const canManage = canManageCompanyDocuments(auth.data.role);
      const [settings] = canManage
        ? await db
            .select({
              bookedCurrency: bankAccountReconciliationSettings.bookedCurrency,
              foreignCurrency:
                bankAccountReconciliationSettings.foreignCurrency,
              maxFxDifference:
                bankAccountReconciliationSettings.maxFxDifference,
              maxFxBps: bankAccountReconciliationSettings.maxFxBps,
              maxDateDistanceDays:
                bankAccountReconciliationSettings.maxDateDistanceDays,
              gainAccountId: bankAccountReconciliationSettings.gainAccountId,
              lossAccountId: bankAccountReconciliationSettings.lossAccountId,
              feeAccountId: bankAccountReconciliationSettings.feeAccountId,
            })
            .from(bankAccountReconciliationSettings)
            .where(
              and(
                eq(bankAccountReconciliationSettings.companyId, companyId),
                eq(bankAccountReconciliationSettings.accountId, accountId),
              ),
            )
        : [];
      return success({
        lines,
        total,
        currentPage: pagination.currentPage,
        pageCount: pagination.pageCount,
        selectedCompanyId: companyId,
        selectedAccountId: accountId,
        selectedAccountName: account.name,
        selectedCurrency: account.currency ?? "EUR",
        selectedCompanyName: account.companyName,
        canManage,
        settings,
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
      const [settings] = await db
        .select()
        .from(bankAccountReconciliationSettings)
        .where(
          and(
            eq(bankAccountReconciliationSettings.accountId, line.accountId),
            eq(bankAccountReconciliationSettings.companyId, line.companyId),
          ),
        );
      const [company] = await db
        .select({ currency: companies.currency })
        .from(companies)
        .where(eq(companies.id, line.companyId));
      const withAdjustments =
        settings &&
        company?.currency === line.currency &&
        (settings.foreignCurrency || (settings.feeAccountId && line.feeAmount));
      const interval = (settings?.maxDateDistanceDays ?? 0) * 86_400_000;
      const booked = new Date(line.bookedDate).getTime();
      const candidates = line.matchedJournalLineId
        ? []
        : await db
            .select({
              id: journalEntryLines.id,
              entryNumber: journalEntries.entryNumber,
              description: sql<string>`coalesce(${journalEntryLines.description}, ${journalEntries.description})`,
              journalDate: journalEntries.date,
              sign: journalEntryLines.type,
              amount: journalEntryLines.amount,
              sourceId: journalEntries.sourceId,
              sourceType: journalEntries.sourceType,
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
                BankReconciliationRepository.matchingCriteria(line, false),
                isNull(bankStatementLines.id),
                or(
                  BankReconciliationRepository.matchingCriteria(line),
                  withAdjustments
                    ? and(
                        inArray(journalEntries.sourceType, [
                          JournalSourceType.AR_PAYMENT,
                          JournalSourceType.AP_PAYMENT,
                        ]),
                        gte(journalEntries.date, new Date(booked - interval)),
                        lt(
                          journalEntries.date,
                          new Date(booked + interval + 86_400_000),
                        ),
                      )
                    : undefined,
                ),
              ),
            )
            .orderBy(
              sql`abs((case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end) - ${line.amount}::numeric)`,
              sql`abs(${journalEntries.date}::date - ${line.bookedDate}::date)`,
              asc(journalEntries.date),
              asc(journalEntryLines.id),
            )
            .limit(50);
      const matched = await Promise.all(
        candidates.map(async (candidate) => {
          const carrying = `${candidate.sign === LineType.CREDIT ? "-" : ""}${candidate.amount.toFixed(4)}`;
          const document =
            carrying !== line.amount && withAdjustments
              ? await getBankPaymentBasis(db, line.companyId, candidate)
              : undefined;
          const plan = planBankMatch({
            ...line,
            carrying,
            booked: line.amount,
            carryingDate: candidate.journalDate,
            settings,
            document,
          });
          return plan
            ? {
                id: candidate.id,
                entryNumber: candidate.entryNumber,
                description: candidate.description,
                journalDate: candidate.journalDate,
                kind: plan.kind,
                fee: Number(plan.fee) / 10_000,
                fx: Number(plan.fx) / 10_000,
              }
            : null;
        }),
      );
      const matches = matched.filter((row) => row !== null);

      return success({
        statementLine: {
          id: line.id,
          transactionId: line.transactionId,
          bookedDate: line.bookedDate,
          amount: line.amount,
          currency: line.currency,
          valueDate: line.valueDate,
          nativeAmount: line.nativeAmount,
          nativeCurrency: line.nativeCurrency,
          feeAmount: line.feeAmount,
          feeCurrency: line.feeCurrency,
          description: line.description,
          counterparty: line.counterparty,
          supplierBillId: line.supplierBillId,
          adjustmentJournalEntryId: line.adjustmentJournalEntryId,
        },
        matches,
        selectedCompanyId: line.companyId,
        matchedJournalLineId: line.matchedJournalLineId,
        matchedAt: line.matchedAt?.toISOString() ?? null,
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
        const access = await getDocumentAccess(
          userId,
          { companyId: data.companyId },
          tx,
        );
        if (!access?.canManage) {
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
            adjustmentJournalEntryId: line.adjustmentJournalEntryId,
            matchKind: line.matchKind ?? "exact",
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

        const [settings] = await tx
          .select()
          .from(bankAccountReconciliationSettings)
          .where(
            and(
              eq(bankAccountReconciliationSettings.accountId, line.accountId),
              eq(bankAccountReconciliationSettings.companyId, line.companyId),
            ),
          )
          .for("share");
        const [candidate] = await tx
          .select({
            id: journalEntryLines.id,
            sign: journalEntryLines.type,
            amount: journalEntryLines.amount,
            date: journalEntries.date,
            sourceId: journalEntries.sourceId,
            sourceType: journalEntries.sourceType,
          })
          .from(journalEntryLines)
          .innerJoin(
            journalEntries,
            eq(journalEntries.id, journalEntryLines.journalEntryId),
          )
          .where(
            and(
              eq(journalEntryLines.id, data.journalLineId),
              BankReconciliationRepository.matchingCriteria(line, false),
            ),
          )
          .limit(1)
          .for("share");

        const carrying = candidate
          ? `${candidate.sign === LineType.CREDIT ? "-" : ""}${candidate.amount.toFixed(4)}`
          : "";
        const document =
          candidate &&
          carrying !== line.amount &&
          company.currency === line.currency
            ? await getBankPaymentBasis(tx, line.companyId, candidate)
            : undefined;
        const plan = candidate
          ? planBankMatch({
              ...line,
              booked: line.amount,
              carrying,
              carryingDate: candidate.date,
              settings,
              document,
            })
          : null;
        if (!candidate || !plan) {
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
        const adjustmentJournalEntryId =
          plan.kind !== "exact" && settings
            ? await postBankAdjustment(
                tx,
                line,
                settings,
                plan,
                userId,
                t("adjustment.description", { reference: line.transactionId }),
                logger,
              )
            : null;
        if (plan.kind !== "exact" && !adjustmentJournalEntryId) {
          return fail({
            message: t("adjustment.unavailable"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const matchedAt = new Date();
        await tx
          .update(bankStatementLines)
          .set({
            matchedAt,
            matchedByUserId: userId,
            matchedJournalLineId: candidate.id,
            adjustmentJournalEntryId,
            matchKind: plan.kind,
          })
          .where(eq(bankStatementLines.id, line.id));
        return success({
          matchedJournalLineId: candidate.id,
          adjustmentJournalEntryId,
          matchKind: plan.kind,
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

  private static async matchSupplierPayments(
    tx: LedgerTransaction,
    scope: {
      companyId: string;
      accountId: string;
      userId: string;
      transactionIds: string[];
    },
  ): Promise<number> {
    const lines = await tx
      .select()
      .from(bankStatementLines)
      .where(
        and(
          eq(bankStatementLines.companyId, scope.companyId),
          eq(bankStatementLines.accountId, scope.accountId),
          inArray(bankStatementLines.transactionId, scope.transactionIds),
          isNull(bankStatementLines.matchedJournalLineId),
          lt(bankStatementLines.amount, "0"),
        ),
      )
      .orderBy(bankStatementLines.id)
      .for("update");
    let confirmed = 0;
    for (const line of lines) {
      const name = line.counterparty?.trim().toLowerCase();
      const booked = bankUnits(line.amount);
      const native = line.nativeAmount && bankUnits(line.nativeAmount);
      if (
        !name ||
        !booked ||
        line.feeAmount !== null ||
        (line.nativeAmount && (!native || !line.nativeCurrency))
      ) {
        continue;
      }
      const [otherStatement] = await tx
        .select({ id: bankStatementLines.id })
        .from(bankStatementLines)
        .where(
          and(
            ne(bankStatementLines.id, line.id),
            eq(bankStatementLines.companyId, scope.companyId),
            eq(bankStatementLines.accountId, scope.accountId),
            eq(bankStatementLines.bookedDate, line.bookedDate),
            eq(bankStatementLines.amount, line.amount),
            eq(bankStatementLines.currency, line.currency),
            isNull(bankStatementLines.matchedJournalLineId),
            sql`lower(btrim(${bankStatementLines.counterparty})) = ${name}`,
          ),
        )
        .limit(1);
      if (otherStatement) {
        continue;
      }
      const [vendor, ambiguous] = await tx
        .select({ id: purchasingVendors.id })
        .from(purchasingVendors)
        .where(
          and(
            eq(purchasingVendors.companyId, scope.companyId),
            eq(purchasingVendors.isActive, true),
            sql`lower(btrim(${purchasingVendors.name})) = ${name}`,
          ),
        )
        .limit(2);
      if (!vendor || ambiguous) {
        continue;
      }

      const documentedCurrency = line.nativeCurrency ?? line.currency;
      const documentedAmount = Math.abs(Number(native || booked)) / 10_000;
      const [candidate, multiple] = await tx
        .select({ id: journalEntryLines.id })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntries.id, journalEntryLines.journalEntryId),
        )
        .innerJoin(
          paymentBills,
          and(
            eq(journalEntries.sourceType, JournalSourceType.AP_PAYMENT),
            eq(paymentBills.id, journalEntries.sourceId),
            eq(paymentBills.companyId, scope.companyId),
            eq(paymentBills.status, BillStatus.PAID),
          ),
        )
        .leftJoin(
          bankStatementLines,
          eq(bankStatementLines.matchedJournalLineId, journalEntryLines.id),
        )
        .where(
          and(
            BankReconciliationRepository.matchingCriteria(line),
            isNull(bankStatementLines.id),
            sql`${paymentBills.currency} = ${documentedCurrency}`,
            eq(paymentBills.total, documentedAmount),
            sql`${paymentBills.metadata}->>'vendorId' = ${vendor.id}`,
            sql`${journalEntries.date}::date = ${line.bookedDate}::date`,
          ),
        )
        .limit(2);

      if (candidate && !multiple) {
        await tx
          .update(bankStatementLines)
          .set({
            matchedJournalLineId: candidate.id,
            matchedByUserId: scope.userId,
            matchedAt: new Date(),
            matchKind: "exact",
          })
          .where(eq(bankStatementLines.id, line.id));
        confirmed++;
      }
    }
    return confirmed;
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
        currency: sql<
          string | null
        >`coalesce(${bankAccountReconciliationSettings.bookedCurrency}, ${companies.currency})`,
      })
      .from(accountNodes)
      .innerJoin(companies, eq(companies.id, accountNodes.companyId))
      .leftJoin(
        bankAccountReconciliationSettings,
        and(
          eq(bankAccountReconciliationSettings.accountId, accountNodes.id),
          eq(bankAccountReconciliationSettings.companyId, companyId),
        ),
      )
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
    const [account] = lock
      ? await query.for("share", { of: accountNodes })
      : await query;
    return account;
  }

  private static matchingCriteria(
    bankLine: Pick<
      typeof bankStatementLines.$inferSelect,
      "companyId" | "accountId" | "amount" | "currency"
    >,
    exact = true,
  ): SQL | undefined {
    return and(
      eq(journalEntries.companyId, bankLine.companyId),
      eq(journalEntries.status, JournalEntryStatus.POSTED),
      ne(journalEntries.sourceType, JournalSourceType.BANK_RECONCILIATION),
      isNull(journalEntries.reversedById),
      eq(journalEntryLines.accountId, bankLine.accountId),
      eq(journalEntryLines.currency, bankLine.currency),
      inArray(journalEntryLines.type, [LineType.DEBIT, LineType.CREDIT]),
      gt(journalEntryLines.amount, 0),
      exact
        ? sql`(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end) = ${bankLine.amount}::numeric`
        : undefined,
    );
  }
}
