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
  LicensesActivationRequestOutput,
  LicensesActivationResponseOutput,
} from "./definition";

const CORVINA_LICENSES_ACTIVATION_PATH = "/api/v1/licenses/activation";

interface CorvinaLicenseProduct {
  id: number;
  code: string;
  type: string;
  label: string;
  trial: boolean;
}

interface CorvinaLicenseActivationResponse {
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

function mapActivatedLicense(
  raw: CorvinaLicenseActivationResponse,
): LicensesActivationResponseOutput {
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
    orgResourceIdResponse: raw.orgResourceId,
  };
}

export class LicensesActivationRepository {
  static async activate(
    data: LicensesActivationRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicensesActivationResponseOutput>> {
    const body: CorvinaBodyObject = {
      licenseCode: data.licenseCode,
    };

    if (data.orgResourceId !== undefined) {
      body.orgResourceId = data.orgResourceId;
    }

    const result =
      await CorvinaClient.request<CorvinaLicenseActivationResponse>(
        {
          method: "POST",
          path: CORVINA_LICENSES_ACTIVATION_PATH,
          body,
          service: "license",
        },
        logger,
        locale,
      );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] License activated", {
      licenseId: result.data.licenseId,
      code: result.data.code,
    });

    return success(mapActivatedLicense(result.data));
  }
}
