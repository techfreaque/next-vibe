import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsAggregatedByOrgRequestOutput,
  SubscriptionsAggregatedByOrgResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_AGGREGATED_BY_ORG_PATH =
  "/api/v1/subscriptions/aggregatedByOrg";

interface CorvinaResourceUsageOrganizationSummaryItem {
  resourceType: string;
  org: string;
  quantity: number;
  used: number;
  licensed: number;
  granted: number;
  grantedUsed: number;
  lastUpdateFreeQuantity: number;
}

export class SubscriptionsAggregatedByOrgRepository {
  static async aggregatedByOrg(
    data: SubscriptionsAggregatedByOrgRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsAggregatedByOrgResponseOutput>> {
    const organizations = data.organizations
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const result = await CorvinaClient.request<
      Record<string, CorvinaResourceUsageOrganizationSummaryItem[]>
    >(
      {
        method: "POST",
        path: CORVINA_SUBSCRIPTIONS_AGGREGATED_BY_ORG_PATH,
        body: { organizations },
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const items = Object.entries(result.data).flatMap(([org, list]) =>
      list.map((item) => ({
        org,
        resourceType: item.resourceType,
        quantity: item.quantity,
        used: item.used,
        licensed: item.licensed,
        granted: item.granted,
        grantedUsed: item.grantedUsed,
        lastUpdateFreeQuantity: item.lastUpdateFreeQuantity,
      })),
    );
    return success({ items });
  }
}
