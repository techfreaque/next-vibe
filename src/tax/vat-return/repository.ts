import "server-only";

import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
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
import { z } from "zod";

import { journalEntries } from "@/chart-of-accounts/db";
import {
  JournalSourceType,
  ledgerEntryStatuses,
} from "@/chart-of-accounts/enum";
import { companies } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";
import {
  paymentBillLines,
  paymentBills,
  paymentInvoiceLines,
  paymentInvoices,
} from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import { VatTreatment } from "../compliance/enum";
import { normalizeIdentifier, vatIdCountry } from "../compliance/identifiers";
import { readLegalSnapshot } from "../compliance/legal-snapshot";
import { getCountryProfile } from "../compliance/profiles";
import {
  TaxReportDirection,
  type TaxReportDirectionValue,
} from "../report/enum";
import { TaxReportRepository } from "../report/repository";
import type {
  VatReturnRequestOutput,
  VatReturnResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import { parseVatPeriod } from "./period";
import {
  buildSkDphReturn,
  type VatReportRow,
  type ZeroRatedSales,
} from "./sk-dph";
import {
  buildKvDphXml,
  type KvCorrectionRow,
  type KvDphInput,
  type KvInvoiceRow,
  type KvReverseChargeIssued,
  type KvTotals,
} from "./sk-kvdph";

const DIRECTIONS: Record<
  typeof TaxReportDirectionValue,
  VatReportRow["direction"]
> = {
  [TaxReportDirection.SALES]: "sales",
  [TaxReportDirection.POS_SALES]: "posSales",
  [TaxReportDirection.CREDIT_NOTES]: "creditNotes",
  [TaxReportDirection.REVERSE_CHARGE]: "reverseCharge",
  [TaxReportDirection.PURCHASES]: "purchases",
  [TaxReportDirection.NON_DEDUCTIBLE]: "nonDeductible",
};

const round2 = (value: number): number => Math.round(value * 100) / 100;
const percent = (rate: number): number => Math.round(rate * 100);

function isSlovakVatId(value: string | null | undefined): value is string {
  return vatIdCountry(value) === "SK";
}

function emptyTotals(): KvTotals {
  return { turnover: 0, base: 0, tax: 0, reducedBase: 0, reducedTax: 0 };
}

function addTotals(
  totals: KvTotals,
  rate: number,
  base: number,
  tax: number,
): void {
  if (percent(rate) === 23) {
    totals.base += base;
    totals.tax += tax;
  } else {
    totals.reducedBase += base;
    totals.reducedTax += tax;
  }
  totals.turnover = (totals.turnover ?? 0) + base + tax;
}

export class VatReturnRepository {
  static async prepare(
    data: VatReturnRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<VatReturnResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const auth = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        null,
        logger,
        locale,
      );
      if (!auth.success) {
        return auth;
      }
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, data.companyId))
        .limit(1);
      if (!company) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const profile = getCountryProfile(company.country);
      if (profile.vatReturn !== "SK_DPH") {
        return fail({
          message: t("unsupportedCountry"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const period = parseVatPeriod(data.period);
      if (!period) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const { start, end } = period;
      const lastDay = new Date(end.getTime() - 86_400_000);

      const report = await TaxReportRepository.getReport(
        {
          companyId: company.id,
          currency: "EUR",
          dateFrom: start,
          dateTo: lastDay,
        },
        userId,
        logger,
        locale,
      );
      if (!report.success) {
        return report;
      }
      const rows: VatReportRow[] = report.data.rows.map((row) => ({
        direction: DIRECTIONS[row.direction],
        rate: row.rate,
        taxableAmount: row.taxableAmount,
        taxAmount: row.taxAmount,
      }));

      // ---- Issued documents (same document date as the tax report) ----
      const documentDate = sql<Date>`coalesce(${journalEntries.date}, ${paymentInvoices.createdAt})`;
      const invoiceRows = await db
        .select({
          id: paymentInvoices.id,
          number: paymentInvoices.invoiceNumber,
          providerInvoiceId: paymentInvoices.providerInvoiceId,
          metadata: paymentInvoices.metadata,
          date: documentDate.mapWith((value: string | Date) =>
            new Date(value).toISOString().slice(0, 10),
          ),
          rate: paymentInvoiceLines.taxRate,
          base: sql<number>`sum(${paymentInvoiceLines.lineTotal} - ${paymentInvoiceLines.taxAmount})`.mapWith(
            Number,
          ),
          tax: sql<number>`sum(${paymentInvoiceLines.taxAmount})`.mapWith(
            Number,
          ),
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
            eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
            inArray(journalEntries.status, ledgerEntryStatuses),
          ),
        )
        .where(
          and(
            eq(paymentInvoices.companyId, company.id),
            eq(paymentInvoices.currency, "EUR"),
            inArray(paymentInvoices.status, [
              InvoiceStatus.OPEN,
              InvoiceStatus.PAID,
              InvoiceStatus.UNCOLLECTIBLE,
            ]),
            gte(documentDate, start.toISOString()),
            lt(documentDate, end.toISOString()),
          ),
        )
        .groupBy(
          paymentInvoices.id,
          paymentInvoices.invoiceNumber,
          paymentInvoices.providerInvoiceId,
          paymentInvoices.metadata,
          documentDate,
          paymentInvoiceLines.taxRate,
        );

      const originalIds = [
        ...new Set(
          invoiceRows.flatMap((row) => {
            const parsed = z
              .object({ originalInvoiceId: z.uuid() })
              .safeParse(row.metadata);
            return parsed.success ? [parsed.data.originalInvoiceId] : [];
          }),
        ),
      ];
      const originals =
        originalIds.length > 0
          ? await db
              .select({
                id: paymentInvoices.id,
                number: paymentInvoices.invoiceNumber,
                providerInvoiceId: paymentInvoices.providerInvoiceId,
                metadata: paymentInvoices.metadata,
              })
              .from(paymentInvoices)
              .where(inArray(paymentInvoices.id, originalIds))
          : [];
      const originalById = new Map(originals.map((row) => [row.id, row]));

      const a1: KvInvoiceRow[] = [];
      const a2: KvReverseChargeIssued[] = [];
      const c1: KvCorrectionRow[] = [];
      const d2 = emptyTotals();
      const zeroRated: ZeroRatedSales = {
        euGoods: 0,
        exports: 0,
        otherExempt: 0,
      };
      let missingCustomerVatIds = 0;
      for (const row of invoiceRows) {
        const isCredit = row.providerInvoiceId.startsWith("CN-");
        const original = isCredit
          ? originalById.get(
              z
                .object({ originalInvoiceId: z.string() })
                .safeParse(row.metadata).data?.originalInvoiceId ?? "",
            )
          : undefined;
        const legal = readLegalSnapshot(original?.metadata ?? row.metadata);
        const treatment = legal?.treatment ?? VatTreatment.DOMESTIC;
        const partnerVatId = normalizeIdentifier(legal?.customer?.vatNumber);
        const number = row.number ?? row.providerInvoiceId;
        const base = round2(row.base);
        const tax = round2(row.tax);
        if (isCredit) {
          c1.push({
            partnerVatId: isSlovakVatId(partnerVatId) ? partnerVatId : null,
            number,
            originalNumber:
              original?.number ?? original?.providerInvoiceId ?? number,
            baseDifference: base,
            taxDifference: tax,
            ratePercent: percent(row.rate > 1 ? row.rate / 100 : row.rate),
          });
          continue;
        }
        if (row.rate === 0) {
          if (treatment === VatTreatment.EU_GOODS_EXEMPT) {
            zeroRated.euGoods += base;
          } else if (treatment === VatTreatment.EXPORT_EXEMPT) {
            zeroRated.exports += base;
          } else if (treatment === VatTreatment.EXEMPT) {
            zeroRated.otherExempt += base;
          } else if (
            treatment === VatTreatment.REVERSE_CHARGE_DOMESTIC &&
            isSlovakVatId(partnerVatId)
          ) {
            a2.push({
              partnerVatId,
              number,
              date: legal?.supplyDate ?? row.date,
              base,
            });
          }
          continue;
        }
        if (isSlovakVatId(partnerVatId)) {
          a1.push({
            partnerVatId,
            number,
            date: legal?.supplyDate ?? row.date,
            base,
            tax,
            ratePercent: percent(row.rate),
          });
        } else {
          if (legal?.customer && !partnerVatId) {
            missingCustomerVatIds += 1;
          }
          addTotals(d2, row.rate, base, tax);
        }
      }

      // ---- Received bills ----
      const billRows = await db
        .select({
          id: paymentBills.id,
          number: paymentBills.billNumber,
          supplierVatId: paymentBills.supplierVatNumber,
          date: paymentBills.billDate,
          metadata: paymentBills.metadata,
          rate: paymentBillLines.taxRate,
          base: sql<number>`sum(${paymentBillLines.lineTotal} - ${paymentBillLines.taxAmount})`.mapWith(
            Number,
          ),
          tax: sql<number>`sum(${paymentBillLines.taxAmount})`.mapWith(Number),
        })
        .from(paymentBillLines)
        .innerJoin(paymentBills, eq(paymentBillLines.billId, paymentBills.id))
        .where(
          and(
            eq(paymentBills.companyId, company.id),
            eq(paymentBills.currency, "EUR"),
            inArray(paymentBills.status, [
              BillStatus.RECEIVED,
              BillStatus.APPROVED,
              BillStatus.PAID,
              BillStatus.DISPUTED,
            ]),
            gte(paymentBills.billDate, start),
            lt(paymentBills.billDate, end),
          ),
        )
        .groupBy(
          paymentBills.id,
          paymentBills.billNumber,
          paymentBills.supplierVatNumber,
          paymentBills.billDate,
          paymentBills.metadata,
          paymentBillLines.taxRate,
        );
      const billMeta = z.object({
        inputVatDeductible: z.boolean().optional(),
        reverseCharge: z
          .object({
            base: z.number(),
            ratePercent: z.number(),
            amount: z.number(),
          })
          .optional(),
      });
      const b1: KvInvoiceRow[] = [];
      const b2: KvInvoiceRow[] = [];
      const b31 = { base: 0, tax: 0, deducted: 0 };
      const reverseSeen = new Set<string>();
      for (const row of billRows) {
        const meta = billMeta.safeParse(row.metadata);
        const deductible = meta.data?.inputVatDeductible !== false;
        const number = row.number ?? row.id.slice(0, 8);
        const date = row.date.toISOString().slice(0, 10);
        const supplierVatId = normalizeIdentifier(row.supplierVatId);
        const reverse = meta.data?.reverseCharge;
        if (reverse) {
          if (!reverseSeen.has(row.id)) {
            reverseSeen.add(row.id);
            b1.push({
              partnerVatId: supplierVatId,
              number,
              date,
              base: reverse.base,
              tax: reverse.amount,
              ratePercent: Math.round(reverse.ratePercent),
              deducted: deductible ? reverse.amount : 0,
            });
          }
          continue;
        }
        if (row.tax === 0) {
          continue;
        }
        const tax = round2(row.tax);
        const base = round2(row.base);
        if (isSlovakVatId(supplierVatId)) {
          b2.push({
            partnerVatId: supplierVatId,
            number,
            date,
            base,
            tax,
            ratePercent: percent(row.rate),
            deducted: deductible ? tax : 0,
          });
        } else {
          b31.base += base;
          b31.tax += tax;
          b31.deducted += deductible ? tax : 0;
        }
      }

      // ---- eKasa / POS turnover (D.1) ----
      const d1 = emptyTotals();
      for (const row of rows) {
        if (row.direction === "posSales" && row.rate !== null) {
          addTotals(d1, row.rate, row.taxableAmount, row.taxAmount);
        }
      }

      const dph = buildSkDphReturn(rows, zeroRated);
      const vatId = normalizeIdentifier(company.vatNumber);
      const kvInput: KvDphInput = {
        identity: {
          vatId: vatId ?? "",
          name: company.name,
          country: "SK",
          city: company.city ?? "",
          postalCode: company.postalCode,
          street: company.addressLine1,
          email: company.email,
        },
        period: period.kv,
        a1,
        a2,
        b1,
        b2,
        b31: b31.tax !== 0 ? b31 : null,
        c1,
        c2: [],
        d1: d1.turnover ? d1 : null,
        d2: d2.turnover ? d2 : null,
      };
      const warnings: VatReturnResponseOutput["warnings"] = [];
      if (!isSlovakVatId(vatId)) {
        warnings.push({ code: "warnings.noVatId" });
      }
      if (missingCustomerVatIds > 0) {
        warnings.push({
          code: "warnings.customerVatIds",
          count: missingCustomerVatIds,
        });
      }
      if (dph.unmapped.length > 0) {
        warnings.push({
          code: "warnings.unmappedRates",
          count: dph.unmapped.length,
        });
      }
      if (b31.tax >= 3000) {
        warnings.push({ code: "warnings.b32Required" });
      }

      return success({
        returnCompanyId: company.id,
        returnCompanyName: company.name,
        returnPeriod: data.period,
        periodFrom: start.toISOString().slice(0, 10),
        periodTo: lastDay.toISOString().slice(0, 10),
        lines: dph.lines,
        sections: [
          { section: "A1", count: a1.length },
          { section: "A2", count: a2.length },
          { section: "B1", count: b1.length },
          { section: "B2", count: b2.length },
          { section: "B31", count: kvInput.b31 ? 1 : 0 },
          { section: "C1", count: c1.length },
          { section: "D1", count: kvInput.d1 ? 1 : 0 },
          { section: "D2", count: kvInput.d2 ? 1 : 0 },
        ],
        warnings,
        kvXml: buildKvDphXml(kvInput),
        kvFileName: `KVDPH_${vatId ?? "SK"}_${data.period}.xml`,
      });
    } catch (error) {
      logger.error("Could not prepare the VAT return", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
