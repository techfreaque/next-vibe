import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  DeviceConfigurationResponseOutput,
  DeviceConfigurationUrlVariablesOutput,
} from "./definition";

interface DeviceConfigurationApiData {
  configJson: string;
}

export class DeviceConfigurationRepository {
  static async get(
    urlPathParams: DeviceConfigurationUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceConfigurationResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/devices/${encodeURIComponent(urlPathParams.deviceId)}/configuration`;
    const result = await CorvinaClient.request<DeviceConfigurationApiData>(
      { method: "GET", path, usePlatformApi: true },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      configJson: JSON.stringify(result.data),
    });
  }
}
