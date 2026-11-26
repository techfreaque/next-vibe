/**
 * POS fiscal settings repository.
 */

import "server-only";

import { and, count, eq, inArray, isNotNull, ne } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { getDocumentCompanies } from "@/finance/document-company-scope";

import {
  DEFAULT_OFFLINE_DEADLINE_HOURS,
  posFiscalProviders,
  posFiscalReceipts,
} from "../db";
import { FiscalAdapterDB, FiscalReceiptStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import { fiscalDecision } from "../policy";
import { getFiscalAdapter, listFiscalAdapters } from "../registry";
import type {
  PosFiscalSettingsGetResponse,
  PosFiscalSettingsPostRequest,
  PosFiscalSettingsPostResponse,
} from "./definition";

const EDIT_ROLES: readonly string[] = [
  CompanyMemberRole.OWNER,
  CompanyMemberRole.ADMIN,
];

function adapterList(): PosFiscalSettingsGetResponse["adapters"] {
  return listFiscalAdapters().flatMap((adapter) => {
    const id = FiscalAdapterDB.find((value) => value === adapter.id);
    return id ? [{ id, certified: adapter.certified }] : [];
  });
}

export class PosFiscalSettingsRepository {
  static async getSettings(
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
    companyId?: string,
  ): Promise<ResponseType<PosFiscalSettingsGetResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const scoped = await getDocumentCompanies(userId, companyId);
      const target = scoped[0];
      if (!target) {
        if (companyId) {
          return fail({
            message: t("errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return success({
          settingsCompanyId: null,
          companyName: null,
          country: null,
          canEdit: false,
          required: false,
          blocked: false,
          provider: null,
          counts: { pending: 0, offline: 0, failed: 0, overdue: 0 },
          adapters: adapterList(),
        });
      }
      const member = await CompanyAuthRepository.requireMember(
        userId,
        target.id,
        null,
        logger,
        locale,
      );
      if (!member.success) {
        return member;
      }
      const [row] = await db
        .select({ country: companies.country, provider: posFiscalProviders })
        .from(companies)
        .leftJoin(
          posFiscalProviders,
          eq(posFiscalProviders.companyId, companies.id),
        )
        .where(eq(companies.id, target.id))
        .limit(1);
      const provider = row?.provider ?? null;
      const decision = fiscalDecision({
        country: row?.country ?? null,
        provider,
      });
      const statusRows = await db
        .select({ status: posFiscalReceipts.status, total: count() })
        .from(posFiscalReceipts)
        .where(
          and(
            eq(posFiscalReceipts.companyId, target.id),
            inArray(posFiscalReceipts.status, [
              FiscalReceiptStatus.PENDING,
              FiscalReceiptStatus.OFFLINE,
              FiscalReceiptStatus.FAILED,
            ]),
          ),
        )
        .groupBy(posFiscalReceipts.status);
      const [overdue] = await db
        .select({ total: count() })
        .from(posFiscalReceipts)
        .where(
          and(
            eq(posFiscalReceipts.companyId, target.id),
            ne(posFiscalReceipts.status, FiscalReceiptStatus.REGISTERED),
            isNotNull(posFiscalReceipts.deadlineMissedAt),
          ),
        );
      const countOf = (status: string): number =>
        statusRows.find((entry) => entry.status === status)?.total ?? 0;
      return success({
        settingsCompanyId: target.id,
        companyName: target.name,
        country: row?.country ?? null,
        canEdit: EDIT_ROLES.includes(member.data.role),
        required: decision.required,
        blocked: decision.blocked,
        provider: provider
          ? {
              adapter: provider.adapter,
              deviceKind: provider.deviceKind,
              cashRegisterCode: provider.cashRegisterCode,
              isEnabled: provider.isEnabled,
              certifiedUntil: provider.certifiedUntil,
              certified: decision.certified,
              credentialRef: provider.settings.credentialRef,
              offlineDeadlineHours: provider.settings.offlineDeadlineHours,
            }
          : null,
        counts: {
          pending: countOf(FiscalReceiptStatus.PENDING),
          offline: countOf(FiscalReceiptStatus.OFFLINE),
          failed: countOf(FiscalReceiptStatus.FAILED),
          overdue: overdue?.total ?? 0,
        },
        adapters: adapterList(),
      });
    } catch (error) {
      logger.error("Error loading POS fiscal settings", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async saveSettings(
    data: PosFiscalSettingsPostRequest,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosFiscalSettingsPostResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const adapter = getFiscalAdapter(data.adapter);
    if (!adapter) {
      return fail({
        message: t("errors.adapterUnknown"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    if (!adapter.deviceKinds.includes(data.deviceKind)) {
      return fail({
        message: t("errors.deviceKindUnsupported"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    if (!adapter.certified && coreEnv.NODE_ENV === Environment.PRODUCTION) {
      return fail({
        message: t("errors.sandboxProduction"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const member = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.ADMIN,
      logger,
      locale,
    );
    if (!member.success) {
      return member;
    }
    try {
      const values = {
        adapter: data.adapter,
        deviceKind: data.deviceKind,
        cashRegisterCode: data.cashRegisterCode,
        isEnabled: data.isEnabled,
        certifiedUntil: data.certifiedUntil
          ? (formatAccountingDateInput(data.certifiedUntil) ?? null)
          : null,
        settings: {
          credentialRef: data.credentialRef || null,
          offlineDeadlineHours:
            data.offlineDeadlineHours ?? DEFAULT_OFFLINE_DEADLINE_HOURS,
        },
        updatedAt: new Date(),
      };
      const [saved] = await db
        .insert(posFiscalProviders)
        .values({ ...values, companyId: data.companyId, createdBy: userId })
        .onConflictDoUpdate({
          target: posFiscalProviders.companyId,
          set: values,
        })
        .returning();
      const [company] = await db
        .select({ country: companies.country })
        .from(companies)
        .where(eq(companies.id, data.companyId));
      const decision = fiscalDecision({
        country: company?.country ?? null,
        provider: saved ?? null,
      });
      return success({
        saved: Boolean(saved),
        blocked: decision.blocked,
        required: decision.required,
      });
    } catch (error) {
      logger.error("Error saving POS fiscal settings", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
