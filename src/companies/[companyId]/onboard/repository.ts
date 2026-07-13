/**
 * Company Onboarding Repository
 * Atomically sets up a new company:
 *   1. CoA from country template (idempotent)
 *   2. Default tax rates for the country (idempotent)
 *   3. Default Cash account node
 *   4. Default Bank account node
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { CoaSetupRepository } from "@/chart-of-accounts/setup/repository";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { taxRates } from "@/tax/db";
import { seedDefaultTaxRates } from "@/tax/default-tax-rates";

import type {
  CompanyOnboardRequestOutput,
  CompanyOnboardResponseOutput,
  CompanyOnboardUrlPathParams,
} from "./definition";
import { scopedTranslation } from "./i18n";

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
    const country = data.country;

    try {
      // Verify ADMIN+ membership
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

      // Step 1: Setup Chart of Accounts (idempotent)
      const coaResult = await CoaSetupRepository.setupChartOfAccounts(
        { companyId, country },
        userId,
        logger,
        locale,
      );

      const accountsCreated = coaResult.success ? coaResult.data.created : 0;
      const accountsSkipped = coaResult.success ? coaResult.data.skipped : 0;

      // Step 2: Seed default tax rates (idempotent)
      const taxRatesBefore = await db
        .select({ id: taxRates.id })
        .from(taxRates)
        .where(eq(taxRates.companyId, companyId));

      await seedDefaultTaxRates(companyId, country, logger);

      const taxRatesAfter = await db
        .select({ id: taxRates.id })
        .from(taxRates)
        .where(eq(taxRates.companyId, companyId));

      const taxRatesCreated = taxRatesAfter.length - taxRatesBefore.length;

      // Step 3: Create default Cash account (idempotent — skip if already exists)
      let cashAccountId: string | null = null;
      const [existingCash] = await db
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.subtype, AccountSubtype.CASH),
            eq(accountNodes.isSystem, false),
          ),
        )
        .limit(1);

      if (existingCash) {
        cashAccountId = existingCash.id;
      } else {
        const [cashAccount] = await db
          .insert(accountNodes)
          .values({
            companyId,
            code: "CASH-DEFAULT",
            name: "Cash",
            type: AccountType.ASSET,
            subtype: AccountSubtype.CASH,
            isPostable: true,
            isActive: true,
            isSystem: false,
            sortOrder: 900,
          })
          .returning({ id: accountNodes.id });

        cashAccountId = cashAccount?.id ?? null;
      }

      // Step 4: Create default Bank account (idempotent)
      let bankAccountId: string | null = null;
      const [existingBank] = await db
        .select()
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.subtype, AccountSubtype.BANK),
            eq(accountNodes.isSystem, false),
          ),
        )
        .limit(1);

      if (existingBank) {
        bankAccountId = existingBank.id;
      } else {
        const [bankAccount] = await db
          .insert(accountNodes)
          .values({
            companyId,
            code: "BANK-DEFAULT",
            name: "Main Bank Account",
            type: AccountType.ASSET,
            subtype: AccountSubtype.BANK,
            isPostable: true,
            isActive: true,
            isSystem: false,
            sortOrder: 901,
          })
          .returning({ id: accountNodes.id });

        bankAccountId = bankAccount?.id ?? null;
      }

      logger.info("Company onboarding complete", {
        companyId,
        country,
        accountsCreated,
        taxRatesCreated,
        cashAccountId,
        bankAccountId,
      });

      return success({
        accountsCreated,
        accountsSkipped,
        taxRatesCreated,
        cashAccountId,
        bankAccountId,
        success: true,
      });
    } catch (error) {
      logger.error("Company onboarding failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
