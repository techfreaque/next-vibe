import "server-only";

import { and, eq, inArray } from "drizzle-orm";
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

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";

import { bankAccountReconciliationSettings } from "../db";
import { scopedTranslation } from "../i18n";
import type { BankSettingsInput, BankSettingsOutput } from "./definition";

export class BankSettingsRepository {
  static async save(
    data: BankSettingsInput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BankSettingsOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const invalid = fail({
      message: t("adjustment.invalidSettings"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
    const {
      companyId,
      accountId,
      gainAccountId,
      lossAccountId,
      feeAccountId,
      foreignCurrency,
    } = data;
    const ids = [accountId, gainAccountId, lossAccountId, feeAccountId].filter(
      (id) => id !== undefined,
    );
    if (
      new Set(ids).size !== ids.length ||
      (foreignCurrency &&
        (foreignCurrency === data.bookedCurrency ||
          !data.maxFxBps ||
          !data.maxFxDifference ||
          Number(data.maxFxDifference) <= 0 ||
          !gainAccountId ||
          !lossAccountId)) ||
      (!foreignCurrency &&
        (data.maxFxBps ||
          data.maxFxDifference ||
          gainAccountId ||
          lossAccountId))
    ) {
      return invalid;
    }
    try {
      return await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, companyId);
        const access = await getDocumentAccess(userId, { companyId }, tx);
        if (!company || !access?.canManage) {
          return fail({
            message: t("errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (
          (foreignCurrency || feeAccountId) &&
          data.bookedCurrency !== company.currency
        ) {
          return invalid;
        }
        const accounts = await tx
          .select()
          .from(accountNodes)
          .where(
            and(
              inArray(accountNodes.id, ids),
              eq(accountNodes.companyId, companyId),
              eq(accountNodes.isActive, true),
              eq(accountNodes.isPostable, true),
            ),
          )
          .orderBy(accountNodes.id)
          .for("share");
        if (
          !accounts.some(
            (row) =>
              row.id === accountId &&
              row.type === AccountType.ASSET &&
              row.subtype === AccountSubtype.BANK,
          ) ||
          (gainAccountId &&
            !accounts.some(
              (row) =>
                row.id === gainAccountId && row.type === AccountType.REVENUE,
            )) ||
          (lossAccountId &&
            !accounts.some(
              (row) =>
                row.id === lossAccountId && row.type === AccountType.EXPENSE,
            )) ||
          (feeAccountId &&
            !accounts.some(
              (row) =>
                row.id === feeAccountId && row.type === AccountType.EXPENSE,
            ))
        ) {
          return invalid;
        }

        const values = {
          companyId,
          accountId,
          bookedCurrency: data.bookedCurrency,
          foreignCurrency: foreignCurrency ?? null,
          gainAccountId: gainAccountId ?? null,
          lossAccountId: lossAccountId ?? null,
          feeAccountId: feeAccountId ?? null,
          maxFxDifference: data.maxFxDifference ?? null,
          maxFxBps: data.maxFxBps ?? null,
          maxDateDistanceDays: data.maxDateDistanceDays,
          configuredByUserId: userId,
          updatedAt: new Date(),
        };
        await tx
          .insert(bankAccountReconciliationSettings)
          .values(values)
          .onConflictDoUpdate({
            target: bankAccountReconciliationSettings.accountId,
            set: values,
          });
        return success({ saved: true });
      });
    } catch (error) {
      logger.error(
        "Bank reconciliation settings save failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
