import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsSummaryByOrgRequestOutput,
  SubscriptionsSummaryByOrgResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_SUMMARY_BY_ORG_PATH =
  "/api/v1/subscriptions/summaryByOrg";

interface CorvinaSubscriptionResource {
  resourceType: string;
  quantity: number;
  used: number;
  expired: boolean;
}

interface CorvinaSubscriptionSummaryItem {
  orgResourceId: string | null;
  licenseId: number;
  productCode: string;
  productLabel: string;
  productType: string;
  licenseCode: string;
  currency: string | null;
  price: number | null;
  autorenew: boolean;
  trial: boolean;
  expirationDate: number | null;
  activationDate: number | null;
  creationDate: number | null;
  resources: CorvinaSubscriptionResource[];
}

interface CorvinaSummaryByOrgPageResponse {
  content: CorvinaSubscriptionSummaryItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class SubscriptionsSummaryByOrgRepository {
  static async list(
    data: SubscriptionsSummaryByOrgRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsSummaryByOrgResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      createdByOrgResourceId: data.createdByOrgResourceId,
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.expired !== undefined) {
      query.expired = data.expired ? 1 : 0;
    }
    if (data.search !== undefined && data.search !== "") {
      query.search = data.search;
    }

    const result = await CorvinaClient.request<CorvinaSummaryByOrgPageResponse>(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_SUMMARY_BY_ORG_PATH,
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
        orgResourceId: item.orgResourceId,
        licenseId: item.licenseId,
        productCode: item.productCode,
        productLabel: item.productLabel,
        productType: item.productType,
        licenseCode: item.licenseCode,
        currency: item.currency,
        price: item.price,
        autorenew: item.autorenew,
        trial: item.trial,
        expirationDate: item.expirationDate,
        activationDate: item.activationDate,
        creationDate: item.creationDate,
        resources: item.resources.map((r) => ({
          resourceType: r.resourceType,
          quantity: r.quantity,
          used: r.used,
          expired: r.expired,
        })),
      })),
    });
  }
}
