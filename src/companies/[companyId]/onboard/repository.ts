/**
 * Initializes company accounts and eligible tax defaults in one transaction.
 */

import "server-only";

import { and, asc, eq, inArray, ne } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
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

import {
  accountingPeriods,
  accountNodes,
  coaTemplateNodes,
  coaTemplates,
} from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { CoaSetupRepository } from "@/chart-of-accounts/setup/repository";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { seedDefaultTaxRates } from "@/tax/default-tax-rates";

import type {
  CompanyOnboardRequestOutput,
  CompanyOnboardResponseOutput,
  CompanyOnboardUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";
import { getCompanySetupCountry } from "./setup-country";

const defaults = [
  {
    subtype: AccountSubtype.CASH,
    code: "CASH-DEFAULT",
    name: "Cash",
    sortOrder: 900,
  },
  {
    subtype: AccountSubtype.BANK,
    code: "BANK-DEFAULT",
    name: "Main Bank Account",
    sortOrder: 901,
  },
];

export class CompanyOnboardRepository {
  static async onboardCompany(
    userId: string,
    urlPathParams: CompanyOnboardUrlPathParams,
    data: CompanyOnboardRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CompanyOnboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { companyId } = urlPathParams;
    const { country } = data;

    try {
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        companyId,
        CompanyMemberRole.ADMIN,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      return await db.transaction(async (tx) => {
        // This is the same company row lock that serializes standalone chart setup.
        const [company] = await tx
          .select({ country: companies.country, name: companies.name })
          .from(companies)
          .where(eq(companies.id, companyId))
          .for("update");
        if (!company) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (country !== getCompanySetupCountry(company.country)) {
          return fail({
            message: t("post.errors.profileMismatch"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const [differentTemplate] = await tx
          .select({ country: coaTemplates.country })
          .from(accountNodes)
          .innerJoin(
            coaTemplateNodes,
            eq(accountNodes.templateNodeId, coaTemplateNodes.id),
          )
          .innerJoin(
            coaTemplates,
            eq(coaTemplateNodes.templateId, coaTemplates.id),
          )
          .where(
            and(
              eq(accountNodes.companyId, companyId),
              ne(coaTemplates.country, country),
            ),
          )
          .limit(1);
        if (differentTemplate) {
          return fail({
            message: t("post.errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const [existingPeriod] = await tx
          .select({ id: accountingPeriods.id })
          .from(accountingPeriods)
          .where(eq(accountingPeriods.companyId, companyId))
          .limit(1);
        const shouldOpenPeriod =
          data.openFirstPeriod === true && !existingPeriod;
        const periodStart = data.periodStart
          ? new Date(data.periodStart)
          : null;
        const periodEnd = data.periodEnd ? new Date(data.periodEnd) : null;
        const periodName = data.periodName?.trim();
        const period =
          shouldOpenPeriod &&
          periodName &&
          periodStart &&
          periodEnd &&
          Number.isFinite(periodStart.getTime()) &&
          Number.isFinite(periodEnd.getTime()) &&
          periodEnd >= periodStart
            ? { name: periodName, startDate: periodStart, endDate: periodEnd }
            : undefined;
        if (shouldOpenPeriod && !period) {
          return fail({
            message: t("post.period.invalid"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const chart = await CoaSetupRepository.seedChartOfAccounts(
          tx,
          { companyId, country },
          locale,
        );
        if (!chart.success) {
          return chart;
        }

        const taxRatesCreated =
          country === "XX"
            ? 0
            : await seedDefaultTaxRates(companyId, country, logger, tx);
        const availableAccounts = await tx
          .select({
            id: accountNodes.id,
            subtype: accountNodes.subtype,
          })
          .from(accountNodes)
          .where(
            and(
              eq(accountNodes.companyId, companyId),
              eq(accountNodes.type, AccountType.ASSET),
              eq(accountNodes.isActive, true),
              eq(accountNodes.isPostable, true),
              inArray(
                accountNodes.subtype,
                defaults.map(({ subtype }) => subtype),
              ),
            ),
          )
          .orderBy(
            asc(accountNodes.isSystem),
            asc(accountNodes.sortOrder),
            asc(accountNodes.code),
          );
        const missingDefaults = defaults.filter(
          ({ subtype }) =>
            !availableAccounts.some((account) => account.subtype === subtype),
        );
        const insertedAccounts =
          missingDefaults.length > 0
            ? await tx
                .insert(accountNodes)
                .values(
                  missingDefaults.map((account) => ({
                    ...account,
                    companyId,
                    type: AccountType.ASSET,
                  })),
                )
                .returning({
                  id: accountNodes.id,
                  subtype: accountNodes.subtype,
                })
            : [];
        const accounts = [...availableAccounts, ...insertedAccounts];
        const [openedPeriod] = period
          ? await tx
              .insert(accountingPeriods)
              .values({ companyId, ...period })
              .returning({ name: accountingPeriods.name })
          : [];

        return success({
          hasPeriods: !!existingPeriod || !!openedPeriod,
          periodCreated: !!openedPeriod,
          periodNameOut: openedPeriod?.name,
          accountsCreated: chart.data.created,
          accountsSkipped: chart.data.skipped,
          taxRatesCreated,
          cashAccountId:
            accounts.find((account) => account.subtype === AccountSubtype.CASH)
              ?.id ?? null,
          bankAccountId:
            accounts.find((account) => account.subtype === AccountSubtype.BANK)
              ?.id ?? null,
          companyIdOut: companyId,
          companyName: company.name,
          success: true,
        });
      });
    } catch (error) {
      logger.error("Company onboarding failed", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
