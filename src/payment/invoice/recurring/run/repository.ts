import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { runDueRecurringInvoices } from "../engine";
import type { RecurringRunRequest, RecurringRunResponse } from "./definition";

export class RecurringRunRepository {
  static async runDue(
    userId: string,
    data: RecurringRunRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RecurringRunResponse>> {
    if (data.companyId) {
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
    }
    const summary = await runDueRecurringInvoices({
      companyId: data.companyId,
      asOfDate: data.asOfDate,
      dryRun: data.dryRun,
      actorUserId: userId,
      logger,
      locale,
    });
    return success(summary);
  }
}
