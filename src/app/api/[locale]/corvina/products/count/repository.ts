import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ProductsCountRequestOutput,
  ProductsCountResponseOutput,
} from "./definition";

const CORVINA_PRODUCTS_COUNT_PATH = "/api/v1/products/count";

interface CorvinaProductCountItem {
  productId: number;
  totalCount: number;
  activeCount: number;
}

interface CorvinaProductCountPage {
  totalElements: number;
  totalPages: number;
  number: number;
  content: CorvinaProductCountItem[];
}

export class ProductsCountRepository {
  static async list(
    data: ProductsCountRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ProductsCountResponseOutput>> {
    const query: Record<string, string | number> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.productId !== undefined) {
      query.productId = data.productId;
    }

    const result = await CorvinaClient.request<CorvinaProductCountPage>(
      {
        method: "GET",
        path: CORVINA_PRODUCTS_COUNT_PATH,
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
      items: result.data.content.map((item) => ({
        productId: item.productId,
        totalCount: item.totalCount,
        activeCount: item.activeCount,
      })),
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
    });
  }
}
