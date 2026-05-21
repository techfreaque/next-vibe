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
  ProductCreateRequestOutput,
  ProductCreateResponseOutput,
} from "./definition";

const CORVINA_PRODUCTS_PATH = "/api/v1/products";

interface CorvinaProductApiResponse {
  id: number;
  code: string;
  type: string;
  label: string;
  dealer: boolean;
  creationDate: number | null;
  lastModified: number | null;
  trial: boolean;
  autorenewDefaultValueForNewLicenses: boolean;
  orgResourceId: string | null;
}

function mapProduct(
  raw: CorvinaProductApiResponse,
): ProductCreateResponseOutput {
  return {
    id: raw.id,
    code: raw.code,
    type: raw.type,
    productLabel: raw.label,
    dealer: raw.dealer,
    trial: raw.trial,
    creationDate: raw.creationDate,
    lastModified: raw.lastModified,
    autorenewDefaultValueForNewLicenses:
      raw.autorenewDefaultValueForNewLicenses,
  };
}

export class ProductCreateRepository {
  static async create(
    data: ProductCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductCreateResponseOutput>> {
    const body: CorvinaBodyObject = {
      code: data.code,
      type: data.type,
      label: data.productLabel,
      trial: data.trial,
      autorenewDefaultValueForNewLicenses:
        data.autorenewDefaultValueForNewLicenses,
    };

    const query: Record<string, string> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaProductApiResponse>(
      {
        method: "POST",
        path: CORVINA_PRODUCTS_PATH,
        body,
        query: Object.keys(query).length > 0 ? query : undefined,
        service: "license",
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Product created", {
      id: result.data.id,
      code: result.data.code,
    });

    return success(mapProduct(result.data));
  }
}
