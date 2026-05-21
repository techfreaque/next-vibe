import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsSummaryRequestOutput,
  SubscriptionsSummaryResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_SUMMARY_PATH = "/api/v1/subscriptions/summary";

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

export class SubscriptionsSummaryRepository {
  static async get(
    data: SubscriptionsSummaryRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsSummaryResponseOutput>> {
    const query: Record<string, string | number | undefined> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.includeExpired !== undefined) {
      query.includeExpired = data.includeExpired ? 1 : 0;
    }

    const result = await CorvinaClient.request<
      CorvinaSubscriptionSummaryItem[]
    >(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_SUMMARY_PATH,
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
