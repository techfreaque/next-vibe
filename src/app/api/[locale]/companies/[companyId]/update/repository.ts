/**
 * Company Update Repository
 */

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

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
