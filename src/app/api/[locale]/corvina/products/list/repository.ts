import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ProductsListRequestOutput,
  ProductsListResponseOutput,
} from "./definition";

const CORVINA_PRODUCTS_PATH = "/api/v1/products";

interface CorvinaProductItem {
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

interface CorvinaProductsPageResponse {
  content: CorvinaProductItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class ProductsListRepository {
  static async list(
    data: ProductsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductsListResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaProductsPageResponse>(
      {
        method: "GET",
        path: CORVINA_PRODUCTS_PATH,
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
      products: result.data.content.map((item) => ({
        id: item.id,
        code: item.code,
        type: item.type,
        label: item.label,
        dealer: item.dealer,
        trial: item.trial,
        creationDate: item.creationDate,
        lastModified: item.lastModified,
        autorenewDefaultValueForNewLicenses:
          item.autorenewDefaultValueForNewLicenses,
        orgResourceId: item.orgResourceId,
      })),
    });
  }
}
