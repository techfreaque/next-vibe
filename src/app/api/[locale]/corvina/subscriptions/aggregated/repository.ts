import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsAggregatedRequestOutput,
  SubscriptionsAggregatedResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_AGGREGATED_PATH =
  "/api/v1/subscriptions/aggregated";

interface CorvinaAggregatedItem {
  resourceType: string;
  org: string;
  quantity: number;
  used: number;
  licensed: number;
  granted: number;
  grantedUsed: number;
  lastUpdateFreeQuantity: number;
}

export class SubscriptionsAggregatedRepository {
  static async list(
    data: SubscriptionsAggregatedRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsAggregatedResponseOutput>> {
    const query: Record<string, string | number> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaAggregatedItem[]>(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_AGGREGATED_PATH,
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
      items: result.data.map((item) => ({
        resourceType: item.resourceType,
        org: item.org,
        quantity: item.quantity,
        used: item.used,
        licensed: item.licensed,
        granted: item.granted,
        grantedUsed: item.grantedUsed,
        lastUpdateFreeQuantity: item.lastUpdateFreeQuantity,
      })),
    });
  }
}
