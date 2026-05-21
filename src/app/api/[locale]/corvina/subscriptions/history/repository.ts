import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsHistoryRequestOutput,
  SubscriptionsHistoryResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_HISTORY_PATH = "/api/v1/subscriptions/history";

interface CorvinaSubscriptionHistoryItem {
  resourceType: string;
  quantity: number;
  used: number;
  granted: number;
  grantedUsed: number;
  licensed: number;
  timestamp: number;
}

interface CorvinaSubscriptionsHistoryPageResponse {
  content: CorvinaSubscriptionHistoryItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class SubscriptionsHistoryRepository {
  static async list(
    data: SubscriptionsHistoryRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsHistoryResponseOutput>> {
    const query: Record<string, string | number> = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.resourceId !== undefined && data.resourceId !== "") {
      query.resourceId = data.resourceId;
    }

    const result =
      await CorvinaClient.request<CorvinaSubscriptionsHistoryPageResponse>(
        {
          method: "GET",
          path: CORVINA_SUBSCRIPTIONS_HISTORY_PATH,
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
      items: result.data.content.map((item) => ({
        resourceType: item.resourceType,
        quantity: item.quantity,
        used: item.used,
        granted: item.granted,
        grantedUsed: item.grantedUsed,
        licensed: item.licensed,
        timestamp: item.timestamp,
      })),
    });
  }
}
