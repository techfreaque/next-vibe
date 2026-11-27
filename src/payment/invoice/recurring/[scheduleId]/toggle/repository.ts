import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { recurringInvoiceSchedules } from "@/payment/db";

import { scopedTranslation } from "../../i18n";
import type {
  RecurringTogglePath,
  RecurringToggleRequest,
  RecurringToggleResponse,
} from "./definition";

export class RecurringToggleRepository {
  static async toggle(
    userId: string,
    urlPathParams: RecurringTogglePath,
    data: RecurringToggleRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RecurringToggleResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const [existing] = await db
      .select({
        id: recurringInvoiceSchedules.id,
        companyId: recurringInvoiceSchedules.companyId,
      })
      .from(recurringInvoiceSchedules)
      .where(eq(recurringInvoiceSchedules.id, urlPathParams.scheduleId))
      .limit(1);
    if (!existing) {
      return fail({
        message: t("errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      existing.companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }
    await db
      .update(recurringInvoiceSchedules)
      .set({
        isEnabled: data.isEnabled,
        ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
        updatedAt: new Date(),
      })
      .where(eq(recurringInvoiceSchedules.id, existing.id));
    return success({ updated: true });
  }
}
