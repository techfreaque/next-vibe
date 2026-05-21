import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsResourceJournalSumRequestOutput,
  SubscriptionsResourceJournalSumResponseOutput,
  SubscriptionsResourceJournalSumUrlParamsOutput,
} from "./definition";

interface CorvinaResourceUsageSumResponse {
  usage: number;
}

export class SubscriptionsResourceJournalSumRepository {
  static async sum(
    urlPathParams: SubscriptionsResourceJournalSumUrlParamsOutput,
    data: SubscriptionsResourceJournalSumRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsResourceJournalSumResponseOutput>> {
    const query: Record<string, string | number | boolean> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.deviceLabel !== undefined && data.deviceLabel !== "") {
      query.deviceLabel = data.deviceLabel;
    }
    if (
      data.organizationFilter !== undefined &&
      data.organizationFilter !== ""
    ) {
      query.organizationFilter = data.organizationFilter;
    }
    if (data.includeSubOrgs !== undefined) {
      query.includeSubOrgs = data.includeSubOrgs;
    }
    if (data.fromDate !== undefined) {
      query.fromDate = data.fromDate;
    }
    if (data.toDate !== undefined) {
      query.toDate = data.toDate;
    }

    const path = `/api/v1/subscriptions/resource/${encodeURIComponent(urlPathParams.resourceType)}/journal/sum`;

    const result = await CorvinaClient.request<CorvinaResourceUsageSumResponse>(
      {
        method: "GET",
        path,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({ totalUsage: result.data.usage });
  }
}
