import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseDeleteResponseOutput,
  LicenseDeleteUrlParamsOutput,
  LicenseGetResponseOutput,
  LicenseGetUrlParamsOutput,
  LicensePutRequestOutput,
  LicensePutResponseOutput,
  LicensePutUrlParamsOutput,
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

function mapLicense(raw: CorvinaLicenseApiResponse): LicenseGetResponseOutput {
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

function buildPath(licenseId: number): string {
  return `/api/v1/licenses/${encodeURIComponent(licenseId)}`;
}

export class LicenseByIdRepository {
  static async getById(
    urlPathParams: LicenseGetUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "GET",
        path: buildPath(urlPathParams.licenseId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapLicense(result.data));
  }

  static async update(
    urlPathParams: LicensePutUrlParamsOutput,
    data: LicensePutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicensePutResponseOutput>> {
    const body: Record<string, boolean | number | null> = {
      autorenew: data.autorenew,
    };
    if (data.expirationDate !== undefined) {
      body.expirationDate = data.expirationDate;
    }
    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "PUT",
        path: buildPath(urlPathParams.licenseId),
        body,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] License updated", {
      licenseId: urlPathParams.licenseId,
    });
    return success(mapLicense(result.data));
  }

  static async remove(
    urlPathParams: LicenseDeleteUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseDeleteResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "DELETE",
        path: buildPath(urlPathParams.licenseId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] License deleted", {
      licenseId: urlPathParams.licenseId,
    });
    return success(mapLicense(result.data));
  }

  static async renew(
    urlPathParams: LicenseRenewUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseRenewResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "POST",
        path: `${buildPath(urlPathParams.licenseId)}/renew`,
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
