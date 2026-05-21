import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseRenewResponseOutput,
  LicenseRenewUrlParamsOutput,
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

function mapLicense(
  raw: CorvinaLicenseApiResponse,
): LicenseRenewResponseOutput {
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

export class LicenseRenewRepository {
  static async renew(
    urlPathParams: LicenseRenewUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseRenewResponseOutput>> {
    const path = `/api/v1/licenses/${encodeURIComponent(urlPathParams.licenseId)}/renew`;

    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "POST",
        path,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] License renewed", {
      licenseId: urlPathParams.licenseId,
    });
    return success(mapLicense(result.data));
  }
}
