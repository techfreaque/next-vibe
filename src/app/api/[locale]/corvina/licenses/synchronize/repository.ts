import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicensesSynchronizeRequestOutput,
  LicensesSynchronizeResponseOutput,
} from "./definition";

const CORVINA_LICENSES_SYNCHRONIZE_PATH = "/api/v1/licenses/synchronize";

export class LicensesSynchronizeRepository {
  static async synchronize(
    data: LicensesSynchronizeRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicensesSynchronizeResponseOutput>> {
    const query: Record<string, string | number> = {};

    if (data.orgResourceId) {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.dryRun !== undefined) {
      query.dryRun = String(data.dryRun);
    }

    const result = await CorvinaClient.request<null>(
      {
        method: "POST",
        path: CORVINA_LICENSES_SYNCHRONIZE_PATH,
        query,
        service: "license",
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Licenses synchronized", { query });

    return success({ synchronized: true });
  }
}
