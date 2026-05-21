import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseTrialDeleteResponseOutput,
  LicenseTrialDeleteUrlParamsOutput,
} from "./definition";

interface CorvinaLicenseProduct {
  id: number;
  code: string;
  type: string;
  label: string;
  trial: boolean;
}

interface CorvinaTrialLicenseApiResponse {
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

function mapLicense(
  raw: CorvinaTrialLicenseApiResponse,
): LicenseTrialDeleteResponseOutput {
  return {
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
  };
}

export class LicenseTrialDeleteRepository {
  static async remove(
    urlPathParams: LicenseTrialDeleteUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseTrialDeleteResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaTrialLicenseApiResponse>(
      {
        method: "DELETE",
        path: `/api/v1/licenses/trial/${encodeURIComponent(urlPathParams.licenseId)}`,
        service: "license",
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Trial license deleted", {
      licenseId: urlPathParams.licenseId,
    });

    return success(mapLicense(result.data));
  }
}
