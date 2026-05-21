import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsAvailableRequestOutput,
  SubscriptionsAvailableResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_AVAILABLE_PATH = "/api/v1/subscriptions/available";

interface CorvinaAvailabilityResponse {
  resourceType: string;
  available: boolean;
  availableAmount: number;
  inDebtSince: string | null;
}

export class SubscriptionsAvailableRepository {
  static async check(
    data: SubscriptionsAvailableRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsAvailableResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      resource: data.resource,
      quantity: data.quantity ?? 1,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaAvailabilityResponse>(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_AVAILABLE_PATH,
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
      resourceType: result.data.resourceType,
      available: result.data.available,
      availableAmount: result.data.availableAmount,
      inDebtSince: result.data.inDebtSince,
    });
  }
}
