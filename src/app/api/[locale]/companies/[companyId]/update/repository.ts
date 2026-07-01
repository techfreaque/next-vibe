/**
 * Company Update Repository
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompaniesRepository } from "../../repository";
import type { CompanyUpdateRequestOutput } from "./definition";

export class CompanyUpdateRepository {
  static async updateCompany(
    companyId: string,
    userId: string,
    data: CompanyUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: { id: string; name: string } }>> {
    return CompaniesRepository.updateCompany(
      companyId,
      userId,
      data.fields ?? {},
      logger,
      locale,
    );
  }
}
