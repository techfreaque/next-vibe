import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseValidateRequestOutput,
  LicenseValidateResponseOutput,
} from "./definition";

interface CorvinaLicenseProduct {
  id: number;
  code: string;
  type: string;
  label: string;
  trial: boolean;
}

interface CorvinaLicenseApiResponse {
  licenseId: number;
  product: CorvinaLicenseProduct;
  creationDate: number | null;
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

export class LicenseValidateRepository {
  static async validate(
    data: LicenseValidateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseValidateResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "GET",
        path: "/api/v1/licenses/validate",
        query: { licenseCode: data.licenseCode },
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const raw = result.data;
    return success({
      licenseId: raw.licenseId,
      productCode: raw.product.code,
      productLabel: raw.product.label,
      productType: raw.product.type,
      productTrial: raw.product.trial,
      creationDate: raw.creationDate,
      expirationDate: raw.expirationDate,
      activationDate: raw.activationDate,
      used: raw.used,
      code: raw.code,
      externalRef: raw.externalRef,
      price: raw.price,
      currency: raw.currency,
      autorenew: raw.autorenew,
      orgResourceId: raw.orgResourceId,
    });
  }
}
