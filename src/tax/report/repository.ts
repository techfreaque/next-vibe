import "server-only";

import {
  and,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  ne,
  notExists,
  or,
  sql,
} from "drizzle-orm";
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

import { journalEntries } from "@/chart-of-accounts/db";
import {
  JournalSourceType,
  ledgerEntryStatuses,
} from "@/chart-of-accounts/enum";
import {
  accountingDay,
  nextAccountingDay,
} from "@/chart-of-accounts/shared/journal-validation";
import { companies, companyMembers } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";
import {
  paymentBillLines,
  paymentBills,
  paymentInvoiceLines,
  paymentInvoices,
} from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";
import { posOrderItems, posOrders, posSessions, posTerminals } from "@/pos/db";
import { PosOrderStatus } from "@/pos/enum";

import { scopedTranslation } from "../i18n";
import type {
  TaxReportRequestOutput,
  TaxReportResponseOutput,
} from "./definition";
import { TaxReportDirection, type TaxReportDirectionValue } from "./enum";

export class TaxReportRepository {
  static async getReport(
    data: TaxReportRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TaxReportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const now = new Date();
      const start = data.dateFrom
        ? accountingDay(data.dateFrom)
        : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const lastDay = accountingDay(data.dateTo ?? now);
      const end = nextAccountingDay(lastDay);
      if (
        !Number.isFinite(start.getTime()) ||
        !Number.isFinite(end.getTime()) ||
        start >= end
      ) {
        return fail({
          message: t("report.errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const selection = {
        id: companies.id,
        name: companies.name,
        currency: companies.currency,
      };
      const companyId = data.companyId;
      if (companyId) {
        const authResult = await CompanyAuthRepository.requireMember(
          userId,
          companyId,
          null,
          logger,
          locale,
        );
        if (!authResult.success) {
          return authResult;
        }
      }

      const matchingCompanies = companyId
        ? await db
            .select(selection)
            .from(companies)
            .where(eq(companies.id, companyId))
        : await db
            .select(selection)
            .from(companies)
            .innerJoin(
              companyMembers,
              eq(companies.id, companyMembers.companyId),
            )
            .where(
              and(
                eq(companyMembers.userId, userId),
                eq(companyMembers.isActive, true),
                eq(companies.isActive, true),
              ),
            )
            .limit(2);
      const [company] = matchingCompanies;
      if (!company || matchingCompanies.length > 1) {
        return fail({
          message: t("report.widget.selectCompany"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const currency =
        data.currency ??
        CurrenciesArr.find((code) => code === company.currency) ??
        "EUR";
      const creditNote = like(paymentInvoices.providerInvoiceId, "CN-%");
      const issuedStatuses = [
        InvoiceStatus.OPEN,
        InvoiceStatus.PAID,
        InvoiceStatus.UNCOLLECTIBLE,
      ];
      const documentDate = sql<Date>`coalesce(${journalEntries.date}, ${paymentInvoices.createdAt})`;
      const invoiceBase = sql`(${paymentInvoiceLines.lineTotal} - ${paymentInvoiceLines.taxAmount})`;
      const savedRate = paymentInvoiceLines.taxRate;

      // Full credits copy fractional rates. Partial credits store percentage
      // points. Compare both interpretations against the persisted line tax.
      const fractionDifference = sql`abs(${invoiceBase} * ${savedRate} - ${paymentInvoiceLines.taxAmount})`;
      const percentDifference = sql`abs(${invoiceBase} * ${savedRate} / 100 - ${paymentInvoiceLines.taxAmount})`;
      const invoiceLines = db
        .select({
          direction: sql<typeof TaxReportDirectionValue>`case when ${creditNote}
            then ${TaxReportDirection.CREDIT_NOTES} else ${TaxReportDirection.SALES}
          end`.as("direction"),
          rate: sql<number | null>`case
            when not ${creditNote} or ${savedRate} = 0 then ${savedRate}
            when ${savedRate} > 1 or ${percentDifference} < ${fractionDifference} then ${savedRate} / 100
            when ${fractionDifference} < ${percentDifference} then ${savedRate}
            else null
          end`
            .mapWith(Number)
            .as("rate"),
          taxableAmount: invoiceBase.as("taxable_amount"),
          taxAmount: sql`${paymentInvoiceLines.taxAmount}`.as("tax_amount"),
        })
        .from(paymentInvoiceLines)
        .innerJoin(
          paymentInvoices,
          eq(paymentInvoiceLines.invoiceId, paymentInvoices.id),
        )
        .leftJoin(
          journalEntries,
          and(
            eq(paymentInvoices.journalEntryId, journalEntries.id),
            eq(paymentInvoices.companyId, journalEntries.companyId),
            eq(paymentInvoices.id, journalEntries.sourceId),
            eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
            inArray(journalEntries.status, ledgerEntryStatuses),
          ),
        )
        .where(
          and(
            eq(paymentInvoices.companyId, company.id),
            eq(paymentInvoices.currency, currency),
            inArray(paymentInvoices.status, issuedStatuses),
            gte(documentDate, start.toISOString()),
            lt(documentDate, end.toISOString()),
          ),
        );

      const billLines = db
        .select({
          direction: sql<
            typeof TaxReportDirectionValue
          >`${TaxReportDirection.PURCHASES}::text`.as("direction"),
          rate: sql<number | null>`${paymentBillLines.taxRate}`
            .mapWith(Number)
            .as("rate"),
          taxableAmount:
            sql`${paymentBillLines.lineTotal} - ${paymentBillLines.taxAmount}`.as(
              "taxable_amount",
            ),
          taxAmount: sql`${paymentBillLines.taxAmount}`.as("tax_amount"),
        })
        .from(paymentBillLines)
        .innerJoin(paymentBills, eq(paymentBillLines.billId, paymentBills.id))
        .where(
          and(
            eq(paymentBills.companyId, company.id),
            eq(paymentBills.currency, currency),
            inArray(paymentBills.status, [
              BillStatus.RECEIVED,
              BillStatus.APPROVED,
              BillStatus.PAID,
              BillStatus.DISPUTED,
            ]),
            gte(paymentBills.billDate, start),
            lt(paymentBills.billDate, end),
          ),
        );

      // An issued invoice with saved lines is the document for a shared sale.
      // The exact journal link avoids guessing from dates or amounts.
      const linkedInvoice = db
        .select({ id: paymentInvoices.id })
        .from(paymentInvoices)
        .innerJoin(
          paymentInvoiceLines,
          eq(paymentInvoiceLines.invoiceId, paymentInvoices.id),
        )
        .where(
          and(
            eq(paymentInvoices.journalEntryId, posOrders.journalEntryId),
            eq(paymentInvoices.companyId, company.id),
            eq(paymentInvoices.currency, currency),
            inArray(paymentInvoices.status, issuedStatuses),
            sql`not coalesce(${creditNote}, false)`,
          ),
        );
      const posLines = db
        .select({
          direction: sql<
            typeof TaxReportDirectionValue
          >`${TaxReportDirection.POS_SALES}::text`.as("direction"),
          rate: sql<number | null>`${posOrderItems.taxRate}`
            .mapWith(Number)
            .as("rate"),
          taxableAmount:
            sql`${posOrderItems.lineTotal} - ${posOrderItems.taxAmount}`.as(
              "taxable_amount",
            ),
          taxAmount: sql`${posOrderItems.taxAmount}`.as("tax_amount"),
        })
        .from(posOrderItems)
        .innerJoin(posOrders, eq(posOrderItems.orderId, posOrders.id))
        .innerJoin(posSessions, eq(posOrders.sessionId, posSessions.id))
        .innerJoin(posTerminals, eq(posSessions.terminalId, posTerminals.id))
        .where(
          and(
            eq(posTerminals.companyId, company.id),
            eq(posOrders.currency, currency),
            eq(posOrders.status, PosOrderStatus.COMPLETED),
            // Completion updates this timestamp atomically. Other order
            // writes require an open order.
            gte(posOrders.updatedAt, start),
            lt(posOrders.updatedAt, end),
            or(gt(posOrderItems.taxRate, 0), ne(posOrderItems.taxAmount, 0)),
            notExists(linkedInvoice),
          ),
        );

      const lines = invoiceLines
        .unionAll(billLines)
        .unionAll(posLines)
        .as("document_lines");
      const grouped = await db
        .select({
          direction: lines.direction,
          rate: lines.rate,
          taxableAmount: sql`sum(${lines.taxableAmount})`.mapWith(Number),
          taxAmount: sql`sum(${lines.taxAmount})`.mapWith(Number),
          directionTax:
            sql`sum(sum(${lines.taxAmount})) over (partition by ${lines.direction})`.mapWith(
              Number,
            ),
          directionBase:
            sql`sum(sum(${lines.taxableAmount})) over (partition by ${lines.direction})`.mapWith(
              Number,
            ),
        })
        .from(lines)
        .groupBy(lines.direction, lines.rate)
        .orderBy(lines.direction, lines.rate);

      const totals = [
        ...new Map(
          grouped.map((row) => [
            row.direction,
            {
              direction: row.direction,
              taxableAmount: row.directionBase,
              taxAmount: row.directionTax,
            },
          ]),
        ).values(),
      ];
      const rows = grouped.map(
        ({ direction, rate, taxableAmount, taxAmount }) => ({
          direction,
          rate,
          taxableAmount,
          taxAmount,
        }),
      );

      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency: currency,
        reportDateFrom: start.toISOString().slice(0, 10),
        reportDateTo: lastDay.toISOString().slice(0, 10),
        rows,
        totals,
      });
    } catch (error) {
      logger.error("Failed to generate tax report", parseError(error));
      return fail({
        message: t("report.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
