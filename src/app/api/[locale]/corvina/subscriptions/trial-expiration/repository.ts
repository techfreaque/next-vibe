import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsTrialExpirationRequestOutput,
  SubscriptionsTrialExpirationResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_TRIAL_PATH =
  "/api/v1/subscriptions/trialExpiration";

export class SubscriptionsTrialExpirationRepository {
  static async get(
    data: SubscriptionsTrialExpirationRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsTrialExpirationResponseOutput>> {
    const query: Record<string, string | number | undefined> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<number>(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_TRIAL_PATH,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({ expirationDate: result.data });
  }
}
