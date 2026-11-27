import "server-only";

import { eq } from "drizzle-orm";
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

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { companyPaymentSettings } from "@/payment/db";

import { scopedTranslation } from "../invoice/recurring/i18n";
import type {
  CompanyPaymentSettingsGetRequest,
  CompanyPaymentSettingsGetResponse,
  CompanyPaymentSettingsPostRequest,
  CompanyPaymentSettingsPostResponse,
} from "./definition";

export class CompanyPaymentSettingsRepository {
  static async getSettings(
    userId: string,
    data: CompanyPaymentSettingsGetRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CompanyPaymentSettingsGetResponse>> {
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
      const [row] = await db
        .select()
        .from(companyPaymentSettings)
        .where(eq(companyPaymentSettings.companyId, data.companyId))
        .limit(1);
      return success({
        bankAccountHolder: row?.bankAccountHolder ?? null,
        bankIban: row?.bankIban ?? null,
        bankBic: row?.bankBic ?? null,
        stripeEnabled: row?.stripeEnabled ?? false,
        stripeAccountLabel: row?.stripeAccountLabel ?? null,
        stripeClearingAccountId: row?.stripeClearingAccountId ?? null,
        autoBookStripePayments: row?.autoBookStripePayments ?? true,
        recurringInvoicesEnabled: row?.recurringInvoicesEnabled ?? false,
      });
    } catch (error) {
      logger.error(
        "Failed to read company payment settings",
        parseError(error),
      );
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async saveSettings(
    userId: string,
    data: CompanyPaymentSettingsPostRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CompanyPaymentSettingsPostResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.ADMIN,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }
    try {
      const ibanClean = data.bankIban
        ? data.bankIban.replaceAll(/\s+/gu, "").toUpperCase()
        : null;
      const bicClean = data.bankBic
        ? data.bankBic.replaceAll(/\s+/gu, "").toUpperCase()
        : null;
      await db
        .insert(companyPaymentSettings)
        .values({
          companyId: data.companyId,
          bankAccountHolder: data.bankAccountHolder?.trim() || null,
          bankIban: ibanClean,
          bankBic: bicClean,
          stripeEnabled: data.stripeEnabled,
          stripeAccountLabel: data.stripeAccountLabel?.trim() || null,
          stripeClearingAccountId: data.stripeClearingAccountId ?? null,
          autoBookStripePayments: data.autoBookStripePayments,
          recurringInvoicesEnabled: data.recurringInvoicesEnabled,
          updatedByUserId: userId,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: companyPaymentSettings.companyId,
          set: {
            bankAccountHolder: data.bankAccountHolder?.trim() || null,
            bankIban: ibanClean,
            bankBic: bicClean,
            stripeEnabled: data.stripeEnabled,
            stripeAccountLabel: data.stripeAccountLabel?.trim() || null,
            stripeClearingAccountId: data.stripeClearingAccountId ?? null,
            autoBookStripePayments: data.autoBookStripePayments,
            recurringInvoicesEnabled: data.recurringInvoicesEnabled,
            updatedByUserId: userId,
            updatedAt: new Date(),
          },
        });
      return success({ saved: true });
    } catch (error) {
      logger.error(
        "Failed to save company payment settings",
        parseError(error),
      );
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
