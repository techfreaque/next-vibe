import "server-only";

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
import { recurringInvoiceSchedules } from "@/payment/db";

import { scopedTranslation } from "../i18n";
import type {
  RecurringCreateRequest,
  RecurringCreateResponse,
} from "./definition";

export class RecurringCreateRepository {
  static async createSchedule(
    userId: string,
    data: RecurringCreateRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RecurringCreateResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }
    try {
      const [created] = await db
        .insert(recurringInvoiceSchedules)
        .values({
          companyId: data.companyId,
          title: data.title.trim(),
          customerName: data.customerName.trim(),
          customerEmail: data.customerEmail?.trim() || null,
          frequency: data.frequency,
          nextRunDate: data.nextRunDate,
          endDate: data.endDate ?? null,
          dueDays: data.dueDays,
          currency: data.currency,
          notes: data.notes?.trim() || null,
          lineTemplates: [
            {
              description: data.lineDescription.trim(),
              quantity: data.lineQuantity,
              unitPrice: data.lineUnitPrice,
              taxRate: data.lineTaxRate,
            },
          ],
          isEnabled: data.isEnabled,
          autoIssue: data.autoIssue,
          autoSendEmail: data.autoSendEmail,
          createdByUserId: userId,
        })
        .returning({ id: recurringInvoiceSchedules.id });
      return success({ scheduleId: created.id });
    } catch (error) {
      logger.error("Failed to create recurring schedule", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
