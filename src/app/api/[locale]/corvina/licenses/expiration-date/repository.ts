import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LicenseExpirationDateRequestOutput,
  LicenseExpirationDateResponseOutput,
} from "./definition";

export class LicenseExpirationDateRepository {
  static async get(
    data: LicenseExpirationDateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LicenseExpirationDateResponseOutput>> {
    const result = await CorvinaClient.request<number>(
      {
        method: "GET",
        path: "/api/v1/licenses/expirationDate",
        query: { licenseCode: data.licenseCode },
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
