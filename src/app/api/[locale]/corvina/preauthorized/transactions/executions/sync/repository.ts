import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { PreauthorizedTransactionsSyncResponseOutput } from "./definition";

export class PreauthorizedTransactionsSyncRepository {
  static async sync(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionsSyncResponseOutput>> {
    const result = await CorvinaClient.request<null>(
      {
        method: "POST",
        path: "/api/v1/preauthorized/transactions/executions/sync",
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transactions executions synced");
    return success({ synchronized: true });
  }
}
