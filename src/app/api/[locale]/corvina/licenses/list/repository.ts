import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseListRequestOutput,
  LicenseListResponseOutput,
} from "./definition";

const CORVINA_LICENSES_PATH = "/api/v1/licenses";

interface CorvinaLicenseProduct {
  id: number;
  code: string;
  type: string;
  label: string;
  trial: boolean;
}

interface CorvinaLicenseItem {
  licenseId: number;
  product: CorvinaLicenseProduct;
  creationDate: number;
  expirationDate: number | null;
  activationDate: number | null;
  used: boolean;
  code: string;
  externalRef: string | null;
  price: number | null;
  currency: string | null;
  autorenew: boolean;
  orgResourceId: string | null;
}

interface CorvinaLicensesPageResponse {
  content: CorvinaLicenseItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class LicensesListRepository {
  static async list(
    data: LicenseListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseListResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaLicensesPageResponse>(
      {
        method: "GET",
        path: CORVINA_LICENSES_PATH,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
      licenses: result.data.content.map((item) => ({
        licenseId: item.licenseId,
        productCode: item.product.code,
        productLabel: item.product.label,
        productType: item.product.type,
        productTrial: item.product.trial,
        creationDate: item.creationDate,
        expirationDate: item.expirationDate,
        activationDate: item.activationDate,
        used: item.used,
        code: item.code,
        externalRef: item.externalRef,
        price: item.price,
        currency: item.currency,
        autorenew: item.autorenew,
        orgResourceId: item.orgResourceId,
      })),
    });
  }
}
