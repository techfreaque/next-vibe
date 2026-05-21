import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  DeviceLicensesJobsVpnRequestOutput,
  DeviceLicensesJobsVpnResponseOutput,
} from "./definition";

const CORVINA_DEVICE_LICENSES_JOBS_VPN_PATH = "/api/v1/deviceLicenses/jobs/vpn";

export class DeviceLicensesJobsVpnRepository {
  static async trigger(
    data: DeviceLicensesJobsVpnRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicensesJobsVpnResponseOutput>> {
    const query: Record<string, string | number> = {};
    if (data.now !== undefined) {
      query.now = data.now;
    }

    const result = await CorvinaClient.request<string>(
      {
        method: "GET",
        path: CORVINA_DEVICE_LICENSES_JOBS_VPN_PATH,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device license VPN job triggered");
    return success({ result: result.data });
  }
}
