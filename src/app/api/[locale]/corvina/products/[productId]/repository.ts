import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ProductDeleteResponseOutput,
  ProductDeleteUrlParamsOutput,
  ProductGetResponseOutput,
  ProductGetUrlParamsOutput,
  ProductPutRequestOutput,
  ProductPutResponseOutput,
  ProductPutUrlParamsOutput,
} from "./definition";

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

function buildPath(productId: number): string {
  return `/api/v1/products/${encodeURIComponent(productId)}`;
}

function mapProduct(raw: CorvinaProductApiResponse): ProductGetResponseOutput {
  return {
    productId: raw.id,
    code: raw.code,
    type: raw.type,
    label: raw.label,
    dealer: raw.dealer,
    trial: raw.trial,
    creationDate: raw.creationDate,
    lastModified: raw.lastModified,
    autorenewDefaultValueForNewLicenses:
      raw.autorenewDefaultValueForNewLicenses,
    orgResourceId: raw.orgResourceId,
  };
}

export class ProductByIdRepository {
  static async getById(
    urlPathParams: ProductGetUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaProductApiResponse>(
      {
        method: "GET",
        path: buildPath(urlPathParams.productId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapProduct(result.data));
  }

  static async update(
    urlPathParams: ProductPutUrlParamsOutput,
    data: ProductPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductPutResponseOutput>> {
    const body: CorvinaBodyObject = {
      code: data.code,
      type: data.type,
      label: data.productLabel,
      trial: data.trial,
      autorenewDefaultValueForNewLicenses:
        data.autorenewDefaultValueForNewLicenses,
    };
    const result = await CorvinaClient.request<CorvinaProductApiResponse>(
      {
        method: "PUT",
        path: buildPath(urlPathParams.productId),
        body,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Product updated", {
      productId: urlPathParams.productId,
    });
    const raw = result.data;
    return success({
      productId: raw.id,
      code: raw.code,
      type: raw.type,
      productLabel: raw.label,
      dealer: raw.dealer,
      trial: raw.trial,
      autorenewDefaultValueForNewLicenses:
        raw.autorenewDefaultValueForNewLicenses,
      creationDate: raw.creationDate,
      lastModified: raw.lastModified,
      orgResourceId: raw.orgResourceId,
    });
  }

  static async remove(
    urlPathParams: ProductDeleteUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductDeleteResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaProductApiResponse>(
      {
        method: "DELETE",
        path: buildPath(urlPathParams.productId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Product deleted", {
      productId: urlPathParams.productId,
    });
    return success(mapProduct(result.data));
  }
}
