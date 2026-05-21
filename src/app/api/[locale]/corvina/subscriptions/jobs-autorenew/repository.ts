import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsJobsAutorenewRequestOutput,
  SubscriptionsJobsAutorenewResponseOutput,
} from "./definition";

const CORVINA_SUBSCRIPTIONS_JOBS_AUTORENEW_PATH =
  "/api/v1/subscriptions/jobs/autorenew";

export class SubscriptionsJobsAutorenewRepository {
  static async trigger(
    data: SubscriptionsJobsAutorenewRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsJobsAutorenewResponseOutput>> {
    const query: Record<string, string | number> = {};
    if (data.now !== undefined) {
      query.now = data.now;
    }

    const result = await CorvinaClient.request<string>(
      {
        method: "GET",
        path: CORVINA_SUBSCRIPTIONS_JOBS_AUTORENEW_PATH,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Subscription auto-renew job triggered");
    return success({ result: result.data });
  }
}
