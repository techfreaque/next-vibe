/**
 * Company Get Repository
 */

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import type { CompanyTypeDB } from "../../enum";
import { CompaniesRepository } from "../../repository";

export class CompanyGetRepository {
  static async getCompany(
    companyId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      id: string;
      name: string;
      type: (typeof CompanyTypeDB)[number];
      vatNumber: string | null;
      taxId: string | null;
      country: string | null;
      currency: string | null;
      email: string | null;
      phone: string | null;
      website: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    return CompaniesRepository.getCompanyById(
      companyId,
      userId,
      logger,
      locale,
    );
  }
}
