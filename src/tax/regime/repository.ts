import "server-only";

import { and, eq } from "drizzle-orm";
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

import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { companyTaxRegimes } from "./db";
import type {
  CompanyRegimeRequest,
  CompanyRegimeResponse,
  RegimeReviewRequest,
  RegimeReviewResponse,
} from "./definition";
import { CompanyTaxRegime } from "./enum";
import { scopedTranslation } from "./i18n";
import { getCompanyTaxRegime } from "./policy";

export class CompanyTaxRegimeRepository {
  static async review(
    data: RegimeReviewRequest,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RegimeReviewResponse>> {
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
      const day = data.asOf ?? new Date();
      const policy = await getCompanyTaxRegime(db, data.companyId, day);
      return success({
        canEdit:
          auth.data.role === CompanyMemberRole.OWNER ||
          auth.data.role === CompanyMemberRole.ADMIN,
        reviewedCompanyId: data.companyId,
        currentRegime: policy.code,
        effectiveOn: day.toISOString().slice(0, 10),
        legalNotice: policy.notice,
      });
    } catch (error) {
      logger.error("Could not read company VAT regime", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async set(
    data: CompanyRegimeRequest,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CompanyRegimeResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      return await db.transaction(async (tx) => {
        await lockLedgerCompany(tx, data.companyId);
        const [member] = await tx
          .select({ role: companyMembers.role, country: companies.country })
          .from(companyMembers)
          .innerJoin(companies, eq(companies.id, companyMembers.companyId))
          .where(
            and(
              eq(companyMembers.companyId, data.companyId),
              eq(companyMembers.userId, userId),
              eq(companyMembers.isActive, true),
              eq(companies.isActive, true),
            ),
          )
          .for("share");
        if (
          !member ||
          (member.role !== CompanyMemberRole.OWNER &&
            member.role !== CompanyMemberRole.ADMIN)
        ) {
          return fail({
            message: t("errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const countries = {
          [CompanyTaxRegime.STANDARD]: undefined,
          [CompanyTaxRegime.DE_SMALL_BUSINESS]: "DE",
          [CompanyTaxRegime.AT_SMALL_BUSINESS]: "AT",
          [CompanyTaxRegime.SK_NON_PAYER]: "SK",
          [CompanyTaxRegime.SK_REGISTERED_7]: "SK",
          [CompanyTaxRegime.SK_REGISTERED_7A]: "SK",
        };
        const jurisdiction = countries[data.election];
        if (jurisdiction && member.country?.toUpperCase() !== jurisdiction) {
          return fail({
            message: t("errors.validation.description"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const day = data.effectiveFrom.toISOString().slice(0, 10);
        await tx
          .insert(companyTaxRegimes)
          .values({
            companyId: data.companyId,
            regime: data.election,
            effectiveFrom: day,
            recordedBy: userId,
          })
          .onConflictDoNothing();
        const regime = await getCompanyTaxRegime(
          tx,
          data.companyId,
          data.effectiveFrom,
        );
        if (regime.code !== data.election) {
          return fail({
            message: t("conflict"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        return success({
          resultRegime: regime.code,
          resultFrom: day,
          notice: regime.notice,
        });
      });
    } catch (error) {
      logger.error("Could not record company VAT regime", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
