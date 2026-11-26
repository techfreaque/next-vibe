/**
 * Chart of Accounts — Accounting Dashboard Repository
 * Aggregates stats: open period, account count, draft count, posted-this-month count
 */

import "server-only";

import {
  and,
  asc,
  count,
  eq,
  gte,
  inArray,
  isNull,
  lt,
  sql,
} from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentCompanies } from "@/finance/document-company-scope";
import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "../db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
  PeriodStatus,
} from "../enum";
import { accountingDay, nextAccountingDay } from "../shared/journal-validation";
import type {
  AccountingDashboardRequestOutput,
  AccountingDashboardResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class AccountingDashboardRepository {
  static async getDashboard(
    data: AccountingDashboardRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<AccountingDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const candidates = await getDocumentCompanies(user.id, data.companyId);
      const [company] = candidates;
      if (!company || (!data.companyId && candidates.length !== 1)) {
        if (data.companyId) {
          return fail({
            message: t("dashboard.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        return success({
          selectedCompanyId: null,
          selectedCompanyName: null,
          canConfigure: false,
          currentPeriodId: null,
          currentPeriodName: null,
          currentPeriodStatus: null,
          currentPeriodStartDate: null,
          currentPeriodEndDate: null,
          accountCount: 0,
          draftEntryCount: 0,
          postedThisMonthCount: 0,
          hasSetup: false,
          currency: "EUR",
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        user.id,
        company.id,
        null,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const now = new Date();
      // 1. Open period
      const openPeriods = await db
        .select({
          id: accountingPeriods.id,
          name: accountingPeriods.name,
          status: accountingPeriods.status,
          startDate: accountingPeriods.startDate,
          endDate: accountingPeriods.endDate,
        })
        .from(accountingPeriods)
        .where(
          and(
            eq(accountingPeriods.companyId, company.id),
            eq(accountingPeriods.status, PeriodStatus.OPEN),
            gte(accountingPeriods.endDate, accountingDay(now)),
            lt(accountingPeriods.startDate, nextAccountingDay(now)),
          ),
        )
        .orderBy(asc(accountingPeriods.startDate), asc(accountingPeriods.id))
        .limit(1);

      const openPeriod = openPeriods[0] ?? null;

      // 2. Active account count
      const accountCountRows = await db
        .select({ cnt: count() })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, company.id),
            eq(accountNodes.isActive, true),
          ),
        );
      const accountCount = accountCountRows[0]?.cnt ?? 0;

      // 3. Draft journal entries count
      const draftCountRows = await db
        .select({ cnt: count() })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, company.id),
            eq(journalEntries.status, JournalEntryStatus.DRAFT),
          ),
        );
      const draftEntryCount = draftCountRows[0]?.cnt ?? 0;

      // 4. Posted entries this calendar month
      const monthStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      const monthEnd = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
      );

      const postedCountRows = await db
        .select({ cnt: count() })
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, company.id),
            inArray(journalEntries.status, ledgerEntryStatuses),
            gte(journalEntries.date, monthStart),
            lt(journalEntries.date, monthEnd),
          ),
        );
      const postedThisMonthCount = postedCountRows[0]?.cnt ?? 0;
      const currency = company.currency ?? "EUR";
      const money = /^[A-Z]{3}$/.test(currency)
        ? await AccountingDashboardRepository.getMoneySummary(
            company.id,
            currency,
            monthStart,
            nextAccountingDay(now),
          )
        : {};

      const canConfigure =
        authResult.data.role === CompanyMemberRole.ADMIN ||
        authResult.data.role === CompanyMemberRole.OWNER;
      const hasSetup = Number(accountCount) > 0;
      const canPost =
        canConfigure || authResult.data.role === CompanyMemberRole.ACCOUNTANT;
      let primaryActionAlias: AccountingDashboardResponseOutput["primaryActionAlias"];
      if (!hasSetup) {
        primaryActionAlias = canConfigure ? "coa-setup" : undefined;
      } else if (!openPeriod) {
        primaryActionAlias = canConfigure ? "coa-period-create" : undefined;
      } else if (canPost) {
        primaryActionAlias = "coa-journal-create";
      }

      return success({
        selectedCompanyId: company.id,
        selectedCompanyName: company.name,
        canConfigure,
        primaryActionAlias,
        currentPeriodId: openPeriod?.id ?? null,
        currentPeriodName: openPeriod?.name ?? null,
        currentPeriodStatus: openPeriod?.status ?? null,
        currentPeriodStartDate:
          openPeriod?.startDate?.toISOString().slice(0, 10) ?? null,
        currentPeriodEndDate:
          openPeriod?.endDate?.toISOString().slice(0, 10) ?? null,
        accountCount: Number(accountCount),
        draftEntryCount: Number(draftEntryCount),
        postedThisMonthCount: Number(postedThisMonthCount),
        hasSetup,
        currency,
        ...money,
      });
    } catch (error) {
      logger.error("Error loading accounting dashboard", parseError(error));
      return fail({
        message: t("dashboard.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async getMoneySummary(
    companyId: string,
    currency: string,
    monthStart: Date,
    tomorrow: Date,
  ): Promise<
    Pick<
      AccountingDashboardResponseOutput,
      | "openReceivables"
      | "approvedPayables"
      | "cashBalance"
      | "monthToDateProfit"
    >
  > {
    const { payments, credits, paymentJoin, creditJoin, openAmount } =
      getInvoiceOpenBalanceParts(db, companyId, currency);
    const billPayments = db
      .select({
        billId: journalEntries.sourceId,
        amount: sql`sum(${journalEntryLines.amount})`.as("paid_amount"),
      })
      .from(journalEntries)
      .innerJoin(
        journalEntryLines,
        eq(journalEntryLines.journalEntryId, journalEntries.id),
      )
      .innerJoin(accountNodes, eq(accountNodes.id, journalEntryLines.accountId))
      .where(
        and(
          eq(journalEntries.companyId, companyId),
          eq(accountNodes.companyId, companyId),
          eq(journalEntries.sourceType, JournalSourceType.AP_PAYMENT),
          eq(journalEntries.status, JournalEntryStatus.POSTED),
          isNull(journalEntries.reversalOfId),
          isNull(journalEntries.reversedById),
          eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_PAYABLE),
          eq(journalEntryLines.type, LineType.DEBIT),
          eq(journalEntryLines.currency, currency),
        ),
      )
      .groupBy(journalEntries.sourceId)
      .as("dashboard_bill_payments");

    const debitMovement = sql`case
      when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount}
      when ${journalEntryLines.type} = ${LineType.CREDIT} then -${journalEntryLines.amount}
      else 0 end`;
    const [[receivables], [payables], [ledger]] = await Promise.all([
      db
        .select({
          amount: sql`coalesce(sum(${openAmount}), 0)`.mapWith(Number),
        })
        .from(paymentInvoices)
        .leftJoin(payments, paymentJoin)
        .leftJoin(credits, creditJoin)
        .where(
          and(
            eq(paymentInvoices.companyId, companyId),
            sql`${paymentInvoices.currency} = ${currency}`,
            eq(paymentInvoices.status, InvoiceStatus.OPEN),
            sql`${paymentInvoices.amount} > 0`,
          ),
        ),
      db
        .select({
          amount:
            sql`coalesce(sum(greatest(0, ${paymentBills.total} - coalesce(${billPayments.amount}, 0))), 0)`.mapWith(
              Number,
            ),
        })
        .from(paymentBills)
        .leftJoin(billPayments, eq(billPayments.billId, paymentBills.id))
        .where(
          and(
            eq(paymentBills.companyId, companyId),
            sql`${paymentBills.currency} = ${currency}`,
            eq(paymentBills.status, BillStatus.APPROVED),
            isNull(paymentBills.paidAt),
          ),
        ),
      db
        .select({
          cashBalance: sql`coalesce(sum(case
            when ${accountNodes.type} = ${AccountType.ASSET}
              and ${inArray(accountNodes.subtype, [AccountSubtype.CASH, AccountSubtype.BANK])}
              then ${debitMovement}
            else 0 end), 0)`.mapWith(Number),
          monthToDateProfit: sql`coalesce(sum(case
            when ${inArray(accountNodes.type, [AccountType.REVENUE, AccountType.EXPENSE])}
              and ${gte(journalEntries.date, monthStart)} then -(${debitMovement})
            else 0 end), 0)`.mapWith(Number),
        })
        .from(journalEntryLines)
        .innerJoin(
          journalEntries,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .innerJoin(
          accountNodes,
          eq(accountNodes.id, journalEntryLines.accountId),
        )
        .where(
          and(
            eq(journalEntries.companyId, companyId),
            eq(accountNodes.companyId, companyId),
            eq(journalEntryLines.currency, currency),
            inArray(journalEntries.status, ledgerEntryStatuses),
            lt(journalEntries.date, tomorrow),
          ),
        ),
    ]);

    return {
      openReceivables: receivables?.amount ?? 0,
      approvedPayables: payables?.amount ?? 0,
      cashBalance: ledger?.cashBalance ?? 0,
      monthToDateProfit: ledger?.monthToDateProfit ?? 0,
    };
  }
}
