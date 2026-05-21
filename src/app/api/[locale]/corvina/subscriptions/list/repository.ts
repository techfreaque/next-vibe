import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsListRequestOutput,
  SubscriptionsListResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_PATH = "/api/v1/subscriptions";

interface CorvinaSubscriptionItem {
  resourceType: string;
  quantity: number;
  used: number;
  expirationDate: number | null;
  creationDate: number | null;
  expired: boolean;
  productCode: string;
  productLabel: string;
  licenseId: number;
  productId: number;
}

interface CorvinaSubscriptionsPageResponse {
  content: CorvinaSubscriptionItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class SubscriptionsListRepository {
  static async list(
    data: SubscriptionsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsListResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.status !== undefined && data.status !== "") {
      query.status = data.status;
    }
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result =
      await CorvinaClient.request<CorvinaSubscriptionsPageResponse>(
        {
          method: "GET",
          path: CORVINA_SUBSCRIPTIONS_PATH,
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
      subscriptions: result.data.content.map((item) => ({
        resourceType: item.resourceType,
        quantity: item.quantity,
        used: item.used,
        expirationDate: item.expirationDate,
        creationDate: item.creationDate,
        expired: item.expired,
        productCode: item.productCode,
        productLabel: item.productLabel,
        licenseId: item.licenseId,
        productId: item.productId,
      })),
    });
  }
}
