import "server-only";

import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
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
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";
import { companies } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";
import { excludePeriodClosing } from "@/finance/supplier-evidence/monthly";
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
import { CompanyTaxRegime } from "../regime/enum";
import { getCompanyTaxRegime } from "../regime/policy";
import {
  TaxReportDirection,
  type TaxReportDirectionValue,
} from "../report/enum";
import { TaxReportRepository } from "../report/repository";
import { buildAtUva } from "./at-uva";
import {
  buildDeUstva,
  buildSmallBusinessEurSummary,
  type EurAccountRow,
} from "./de-ustva";
import type {
  VatReturnRequestOutput,
  VatReturnResponseOutput,
} from "./definition";
import { buildGenericVatReturn } from "./generic-vat";
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

async function loadEurAccounts(
  companyId: string,
  currency: string,
  start: Date,
  end: Date,
): Promise<EurAccountRow[]> {
  const rows = await db
    .select({
      code: accountNodes.code,
      name: accountNodes.name,
      type: accountNodes.type,
      netDebit:
        sql<number>`sum(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end)`.mapWith(
          Number,
        ),
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntryLines.journalEntryId, journalEntries.id),
    )
    .innerJoin(accountNodes, eq(journalEntryLines.accountId, accountNodes.id))
    .where(
      and(
        eq(journalEntries.companyId, companyId),
        eq(accountNodes.companyId, companyId),
        inArray(journalEntries.status, ledgerEntryStatuses),
        excludePeriodClosing(),
        eq(journalEntryLines.currency, currency),
        gte(journalEntries.date, start),
        lt(journalEntries.date, end),
        inArray(accountNodes.type, [AccountType.REVENUE, AccountType.EXPENSE]),
      ),
    )
    .groupBy(accountNodes.code, accountNodes.name, accountNodes.type)
    .orderBy(accountNodes.code);

  return rows.map((row) => ({
    code: row.code,
    name: row.name,
    kind: row.type === AccountType.REVENUE ? "revenue" : "expense",
    amount:
      row.type === AccountType.REVENUE
        ? round2(-row.netDebit)
        : round2(row.netDebit),
  }));
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
      const period = parseVatPeriod(data.period);
      if (!period) {
        return fail({
          message: t("errors.validation.description"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      const { start, end } = period;
      const lastDay = new Date(end.getTime() - 86_400_000);
      const periodFrom = start.toISOString().slice(0, 10);
      const periodTo = lastDay.toISOString().slice(0, 10);

      const profile = getCountryProfile(company.country);
      const country = (company.country ?? profile.country).trim().toUpperCase();
      const currency = (company.currency ?? "EUR").trim().toUpperCase();
      const regime = await getCompanyTaxRegime(db, company.id, lastDay);

      // ---- Small-business exemption (DE § 19 UStG / AT § 6 Abs. 1 Z 27) ----
      if (
        (profile.vatReturn === "DE_USTVA" &&
          regime.code === CompanyTaxRegime.DE_SMALL_BUSINESS) ||
        (profile.vatReturn === "AT_UVA" &&
          regime.code === CompanyTaxRegime.AT_SMALL_BUSINESS)
      ) {
        const eurAccounts = await loadEurAccounts(
          company.id,
          currency,
          start,
          end,
        );
        const eur = buildSmallBusinessEurSummary(
          eurAccounts,
          data.period,
          profile.country,
        );
        return success({
          returnCompanyId: company.id,
          returnCompanyName: company.name,
          country,
          currency,
          filingFormat:
            profile.vatReturn === "DE_USTVA"
              ? "DE_EUR_SMALL_BUSINESS"
              : "AT_EA_SMALL_BUSINESS",
          smallBusinessExempt: true,
          returnPeriod: data.period,
          periodFrom,
          periodTo,
          lines: eur.lines,
          sections: [],
          warnings: [],
          kvXml: "",
          kvFileName: "",
          exportCsv: eur.csv,
          exportCsvFileName: eur.csvFileName,
        });
      }

      const reportCurrency = CurrenciesArr.find((c) => c === currency) ?? "EUR";
      const report = await TaxReportRepository.getReport(
        {
          companyId: company.id,
          currency: reportCurrency,
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

      // ---- Issued documents (for zero-rated classification & SK KV) ----
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
            sql`${paymentInvoices.currency} = ${currency}`,
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

      const zeroRated: ZeroRatedSales & { euServicesReverseCharge: number } = {
        euGoods: 0,
        exports: 0,
        otherExempt: 0,
        euServicesReverseCharge: 0,
      };
      for (const row of invoiceRows) {
        if (row.providerInvoiceId.startsWith("CN-")) {
          continue;
        }
        if (row.rate === 0) {
          const legal = readLegalSnapshot(row.metadata);
          const treatment = legal?.treatment ?? VatTreatment.DOMESTIC;
          const base = round2(row.base);
          if (treatment === VatTreatment.EU_GOODS_EXEMPT) {
            zeroRated.euGoods += base;
          } else if (treatment === VatTreatment.EXPORT_EXEMPT) {
            zeroRated.exports += base;
          } else if (treatment === VatTreatment.EU_SERVICES_REVERSE_CHARGE) {
            zeroRated.euServicesReverseCharge += base;
          } else if (treatment === VatTreatment.EXEMPT) {
            zeroRated.otherExempt += base;
          }
        }
      }

      // ---- German UStVA adapter ----
      if (profile.vatReturn === "DE_USTVA") {
        const ustva = buildDeUstva(
          rows,
          zeroRated,
          {
            companyName: company.name,
            steuernummer: company.taxId,
            vatId: normalizeIdentifier(company.vatNumber),
            street: company.addressLine1,
            postalCode: company.postalCode,
            city: company.city,
            email: company.email,
          },
          period.kv,
          data.period,
        );
        const warnings: VatReturnResponseOutput["warnings"] = [];
        if (ustva.missingSteuernummer) {
          warnings.push({ code: "warnings.noTaxId" });
        }
        if (ustva.unmapped.length > 0) {
          warnings.push({
            code: "warnings.unmappedRates",
            count: ustva.unmapped.length,
          });
        }
        return success({
          returnCompanyId: company.id,
          returnCompanyName: company.name,
          country,
          currency,
          filingFormat: "DE_USTVA",
          smallBusinessExempt: false,
          returnPeriod: data.period,
          periodFrom,
          periodTo,
          lines: ustva.lines,
          sections: [],
          warnings,
          kvXml: ustva.elsterXml,
          kvFileName: ustva.elsterFileName,
          exportCsv: ustva.csv,
          exportCsvFileName: ustva.csvFileName,
        });
      }

      // ---- Austrian UVA (U30) adapter ----
      if (profile.vatReturn === "AT_UVA") {
        const uva = buildAtUva(
          rows,
          zeroRated,
          {
            companyName: company.name,
            taxId: company.taxId,
            vatId: normalizeIdentifier(company.vatNumber),
          },
          period.kv,
          data.period,
        );
        const warnings: VatReturnResponseOutput["warnings"] = [];
        if (uva.missingVatId) {
          warnings.push({ code: "warnings.noVatId" });
        }
        if (uva.unmapped.length > 0) {
          warnings.push({
            code: "warnings.unmappedRates",
            count: uva.unmapped.length,
          });
        }
        return success({
          returnCompanyId: company.id,
          returnCompanyName: company.name,
          country,
          currency,
          filingFormat: "AT_UVA",
          smallBusinessExempt: false,
          returnPeriod: data.period,
          periodFrom,
          periodTo,
          lines: uva.lines,
          sections: [],
          warnings,
          kvXml: uva.xml,
          kvFileName: uva.xmlFileName,
          exportCsv: uva.csv,
          exportCsvFileName: uva.csvFileName,
        });
      }

      // ---- Generic country VAT summary adapter ----
      if (profile.vatReturn !== "SK_DPH") {
        const generic = buildGenericVatReturn(
          rows,
          zeroRated,
          country,
          currency,
          data.period,
        );
        return success({
          returnCompanyId: company.id,
          returnCompanyName: company.name,
          country,
          currency,
          filingFormat: "GENERIC_VAT",
          smallBusinessExempt: false,
          returnPeriod: data.period,
          periodFrom,
          periodTo,
          lines: generic.lines,
          sections: [],
          warnings: [],
          kvXml: "",
          kvFileName: "",
          exportCsv: generic.csv,
          exportCsvFileName: generic.csvFileName,
        });
      }

      // ---- Slovak DPHv25 + KVDPHv25 adapter ----
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
          if (
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

      const skCsv = [
        "line;meaning;amount",
        ...dph.lines.map(
          (l) => `${l.line};"${t(`lines.${l.line}`)}";${l.amount.toFixed(2)}`,
        ),
      ].join("\n");

      return success({
        returnCompanyId: company.id,
        returnCompanyName: company.name,
        country: "SK",
        currency: "EUR",
        filingFormat: "SK_DPH",
        smallBusinessExempt: false,
        returnPeriod: data.period,
        periodFrom,
        periodTo,
        lines: dph.lines.map((l) => ({
          line: l.line,
          label: t(`lines.${l.line}`),
          amount: l.amount,
          isTotal: l.line === "r17" || l.line === "r32" || l.line === "r33",
        })),
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
        exportCsv: skCsv,
        exportCsvFileName: `DPH_${data.period}.csv`,
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
