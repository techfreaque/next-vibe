import "server-only";

import { and, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
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
  coaTemplateNodes,
  coaTemplates,
} from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { CompanyAuthRepository } from "@/companies/repository";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { getFiscalRequirement } from "@/pos/fiscal/policy";

import { taxRates } from "../db";
import { companyTaxRegimes } from "../regime/db";
import { CompanyTaxRegime } from "../regime/enum";
import { getCompanyTaxRegime } from "../regime/policy";
import type {
  TaxComplianceRequestOutput,
  TaxComplianceResponseOutput,
} from "./definition";
import { ComplianceIssue, ComplianceSeverity } from "./enum";
import { scopedTranslation } from "./i18n";
import { checkIssuerIdentity, type ComplianceFinding } from "./invoice-rules";
import { getCountryProfile, isVatRateValidOn } from "./profiles";

function formatEuro(amount: number): string {
  return `${amount.toFixed(2)} EUR`;
}

export class TaxComplianceRepository {
  static async review(
    data: TaxComplianceRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TaxComplianceResponseOutput>> {
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
          message: t("review.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const today = new Date();
      const todayIso = today.toISOString().slice(0, 10);
      const profile = getCountryProfile(company.country);
      const regime = await getCompanyTaxRegime(db, company.id, today);
      const findings: ComplianceFinding[] = checkIssuerIdentity(
        profile,
        regime.code,
        company,
      );

      if (profile.regimes.length > 1) {
        const [election] = await db
          .select({ regime: companyTaxRegimes.regime })
          .from(companyTaxRegimes)
          .where(eq(companyTaxRegimes.companyId, company.id))
          .limit(1);
        if (!election) {
          findings.push({
            code: ComplianceIssue.REGIME_NOT_ELECTED,
            severity: ComplianceSeverity.WARNING,
          });
        }
      }

      const templates = await db
        .selectDistinct({ country: coaTemplates.country })
        .from(accountNodes)
        .innerJoin(
          coaTemplateNodes,
          eq(accountNodes.templateNodeId, coaTemplateNodes.id),
        )
        .innerJoin(
          coaTemplates,
          eq(coaTemplateNodes.templateId, coaTemplates.id),
        )
        .where(eq(accountNodes.companyId, company.id));
      if (
        templates.length === 0 ||
        templates.some(({ country }) => country !== profile.chartTemplate)
      ) {
        findings.push({
          code: ComplianceIssue.CHART_TEMPLATE_MISMATCH,
          severity: ComplianceSeverity.WARNING,
        });
      }

      if (regime.code === CompanyTaxRegime.STANDARD) {
        const rates = await db
          .select({
            rate: taxRates.rate,
            validTo: taxRates.validTo,
          })
          .from(taxRates)
          .where(
            and(
              eq(taxRates.companyId, company.id),
              eq(taxRates.isActive, true),
              or(isNull(taxRates.validTo), gte(taxRates.validTo, todayIso)),
            ),
          );
        const standard = profile.vatRates.find(
          (rate) =>
            rate.kind === "standard" &&
            isVatRateValidOn(profile, rate.rate, today),
        );
        if (
          standard &&
          !rates.some((row) => Math.abs(row.rate - standard.rate) < 0.000_05)
        ) {
          findings.push({
            code: ComplianceIssue.TAX_RATES_MISSING,
            severity: ComplianceSeverity.WARNING,
          });
        }
        if (
          profile.invoice.enforceRates &&
          rates.some(
            (row) =>
              row.validTo === null &&
              !isVatRateValidOn(profile, row.rate, today),
          )
        ) {
          findings.push({
            code: ComplianceIssue.TAX_RATES_OUTDATED,
            severity: ComplianceSeverity.WARNING,
          });
        }
      }

      const fiscal = await getFiscalRequirement(db, company.id);
      if (fiscal.required && fiscal.blocked) {
        findings.push({
          code: ComplianceIssue.FISCAL_PROVIDER_MISSING,
          severity: ComplianceSeverity.WARNING,
        });
      }

      const mandatoryFrom = profile.eInvoicing.mandatoryFrom;
      if (mandatoryFrom && mandatoryFrom > todayIso) {
        findings.push({
          code: ComplianceIssue.E_INVOICING_UPCOMING,
          severity: ComplianceSeverity.INFO,
          params: { date: mandatoryFrom },
        });
      }

      const threshold = profile.vatRegistration.threshold;
      if (threshold !== null && regime.code !== CompanyTaxRegime.STANDARD) {
        const yearStart = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
        const nextYear = new Date(Date.UTC(today.getUTCFullYear() + 1, 0, 1));
        const [turnoverRow] = await db
          .select({
            turnover:
              sql<number>`coalesce(sum(case when ${paymentInvoices.providerInvoiceId} like 'CN-%' then -${paymentInvoices.amount} else ${paymentInvoices.amount} end), 0)`.mapWith(
                Number,
              ),
          })
          .from(paymentInvoices)
          .where(
            and(
              eq(paymentInvoices.companyId, company.id),
              eq(paymentInvoices.currency, "EUR"),
              inArray(paymentInvoices.status, [
                InvoiceStatus.OPEN,
                InvoiceStatus.PAID,
                InvoiceStatus.UNCOLLECTIBLE,
              ]),
              gte(paymentInvoices.createdAt, yearStart),
              lt(paymentInvoices.createdAt, nextYear),
            ),
          );
        const turnover = turnoverRow?.turnover ?? 0;
        if (turnover > threshold) {
          findings.push({
            code: ComplianceIssue.VAT_THRESHOLD_EXCEEDED,
            severity: ComplianceSeverity.ERROR,
            params: {
              turnover: formatEuro(turnover),
              threshold: formatEuro(threshold),
            },
          });
        } else if (turnover >= threshold * 0.8) {
          findings.push({
            code: ComplianceIssue.VAT_THRESHOLD_NEAR,
            severity: ComplianceSeverity.WARNING,
            params: {
              turnover: formatEuro(turnover),
              threshold: formatEuro(threshold),
            },
          });
        }
      }

      const order = {
        [ComplianceSeverity.ERROR]: 0,
        [ComplianceSeverity.WARNING]: 1,
        [ComplianceSeverity.INFO]: 2,
      };
      return success({
        checkedCompanyId: company.id,
        companyName: company.name,
        country: profile.country,
        regime: regime.code,
        findings: findings.toSorted(
          (a, b) => order[a.severity] - order[b.severity],
        ),
        vatReturnAvailable: profile.vatReturn !== null,
        statementsAvailable: profile.statements !== null,
        fiscalReceiptsRequired: fiscal.required,
        eInvoicingFrom: profile.eInvoicing.mandatoryFrom,
      });
    } catch (error) {
      logger.error("Could not run the compliance check", parseError(error));
      return fail({
        message: t("review.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
