import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseCreateRequestOutput,
  LicenseCreateResponseOutput,
} from "./definition";

const CORVINA_LICENSES_PATH = "/api/v1/licenses";

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
): LicenseCreateResponseOutput {
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

export class LicenseCreateRepository {
  static async create(
    data: LicenseCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseCreateResponseOutput>> {
    const body: CorvinaBodyObject = {
      productId: data.productId,
      autorenew: data.autorenew,
    };

    if (data.expirationDate !== undefined && data.expirationDate !== null) {
      body.expirationDate = data.expirationDate;
    }
    if (data.price !== undefined && data.price !== null) {
      body.price = data.price;
    }
    if (data.currency !== undefined && data.currency !== null) {
      body.currency = data.currency;
    }
    if (data.externalRef !== undefined && data.externalRef !== null) {
      body.externalRef = data.externalRef;
    }
    if (data.targetOrgResourceId !== undefined) {
      body.targetOrgResourceId = data.targetOrgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaLicenseApiResponse>(
      {
        method: "POST",
        path: CORVINA_LICENSES_PATH,
        body,
        service: "license",
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] License created", {
      licenseId: result.data.licenseId,
    });

    return success(mapLicense(result.data));
  }
}
