import "server-only";

import { and, eq, gte, inArray, isNull, sql } from "drizzle-orm";
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

import { getDocumentCompanies } from "@/finance/document-company-scope";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";
import type { PayablesAgingRequest, PayablesAgingResponse } from "./definition";
import { scopedTranslation } from "./i18n";
import { type AgingBucket, billAgingBucket } from "./model";

type Section = PayablesAgingResponse["approved"];
type Totals = Section["totals"];
type Supplier = Section["suppliers"][number];

function emptyTotals(): Totals {
  return {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    undated: 0,
    total: 0,
  };
}

function addCents(totals: Totals, bucket: AgingBucket, amount: number): void {
  totals[bucket] += amount;
  totals.total += amount;
}

export class PayablesAgingRepository {
  static async getPayablesAging(
    data: PayablesAgingRequest,
    logger: EndpointLogger,
    userId: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PayablesAgingResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const reportDate = data.agingDate ?? new Date().toISOString().slice(0, 10);
    try {
      const companies = await getDocumentCompanies(userId, data.companyId);
      const company = companies.length === 1 ? companies[0] : undefined;
      if (!company) {
        return data.companyId
          ? fail({
              message: t("errors.forbidden.description"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            })
          : success({
              reportCompanyId: null,
              reportCompanyName: null,
              reportCurrency: null,
              reportDate,
              approved: { suppliers: [], totals: emptyTotals() },
              received: { suppliers: [], totals: emptyTotals() },
              disputed: { suppliers: [], totals: emptyTotals() },
            });
      }

      const currency = data.currency ?? company.currency;
      if (!currency || !/^[A-Z]{3}$/.test(currency)) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const payments = db
        .select({
          billId: journalEntries.sourceId,
          paid: sql<string>`sum(${journalEntryLines.amount})`.as("paid"),
        })
        .from(journalEntries)
        .innerJoin(
          journalEntryLines,
          eq(journalEntryLines.journalEntryId, journalEntries.id),
        )
        .innerJoin(
          accountNodes,
          eq(accountNodes.id, journalEntryLines.accountId),
        )
        .where(
          and(
            eq(journalEntries.companyId, company.id),
            eq(journalEntries.sourceType, JournalSourceType.AP_PAYMENT),
            eq(journalEntries.status, JournalEntryStatus.POSTED),
            isNull(journalEntries.reversalOfId),
            isNull(journalEntries.reversedById),
            eq(accountNodes.companyId, company.id),
            eq(accountNodes.subtype, AccountSubtype.ACCOUNTS_PAYABLE),
            eq(journalEntryLines.type, LineType.DEBIT),
            sql`${journalEntryLines.currency} = ${currency}`,
          ),
        )
        .groupBy(journalEntries.sourceId)
        .as("bill_payments");
      const bills = await db
        .select({
          id: paymentBills.id,
          supplier: paymentBills.supplierName,
          supplierVat: paymentBills.supplierVatNumber,
          status: paymentBills.status,
          billNumber: paymentBills.billNumber,
          billDate: paymentBills.billDate,
          dueDate: paymentBills.dueDate,
          amount: sql<number>`round(greatest(0, ${paymentBills.total} -
            case when ${paymentBills.status} = ${BillStatus.RECEIVED}
                 then 0 else coalesce(${payments.paid}, 0) end) * 100)`.mapWith(
            Number,
          ),
        })
        .from(paymentBills)
        .leftJoin(payments, eq(payments.billId, paymentBills.id))
        .where(
          and(
            eq(paymentBills.companyId, company.id),
            sql`${paymentBills.currency} = ${currency}`,
            inArray(paymentBills.status, [
              BillStatus.APPROVED,
              BillStatus.RECEIVED,
              BillStatus.DISPUTED,
            ]),
            isNull(paymentBills.paidAt),
            gte(paymentBills.total, 0),
          ),
        )
        .orderBy(paymentBills.dueDate, paymentBills.billDate, paymentBills.id);

      const approved = {
        suppliers: new Map<string, Supplier>(),
        totals: emptyTotals(),
      };
      const received = {
        suppliers: new Map<string, Supplier>(),
        totals: emptyTotals(),
      };
      const disputed = {
        suppliers: new Map<string, Supplier>(),
        totals: emptyTotals(),
      };
      const agingDay = Date.parse(reportDate);
      for (const bill of bills) {
        if (bill.status === BillStatus.APPROVED && bill.amount === 0) {
          continue;
        }
        const section =
          bill.status === BillStatus.APPROVED
            ? approved
            : bill.status === BillStatus.DISPUTED
              ? disputed
              : received;
        const name = bill.supplier.trim().replace(/\s+/gu, " ");
        const vat =
          bill.supplierVat?.replace(/[\s.-]+/gu, "").toUpperCase() || null;
        const key = vat
          ? `vat:${vat}`
          : name
            ? `name:${name.toLowerCase()}`
            : `bill:${bill.id}`;
        const supplier = section.suppliers.get(key) ?? {
          key,
          supplier: name,
          supplierVat: vat,
          totals: emptyTotals(),
          bills: [],
        };
        const bucket = billAgingBucket(bill.dueDate, agingDay);
        supplier.bills.push({
          id: bill.id,
          billNumber: bill.billNumber,
          billDate: bill.billDate.toISOString().slice(0, 10),
          dueDate: bill.dueDate?.toISOString().slice(0, 10) ?? null,
          amountCents: bill.amount,
        });
        addCents(supplier.totals, bucket, bill.amount);
        addCents(section.totals, bucket, bill.amount);
        section.suppliers.set(key, supplier);
      }
      if (
        !Number.isSafeInteger(approved.totals.total) ||
        !Number.isSafeInteger(received.totals.total) ||
        !Number.isSafeInteger(disputed.totals.total)
      ) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const sortSuppliers = (groups: Map<string, Supplier>): Supplier[] =>
        [...groups.values()].toSorted(
          (a, b) =>
            b.totals.total - a.totals.total ||
            a.supplier.localeCompare(b.supplier, locale) ||
            a.key.localeCompare(b.key),
        );
      return success({
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency: currency,
        reportDate,
        approved: {
          suppliers: sortSuppliers(approved.suppliers),
          totals: approved.totals,
        },
        received: {
          suppliers: sortSuppliers(received.suppliers),
          totals: received.totals,
        },
        disputed: {
          suppliers: sortSuppliers(disputed.suppliers),
          totals: disputed.totals,
        },
      });
    } catch (error) {
      logger.error(
        "Error computing supplier payables aging",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
