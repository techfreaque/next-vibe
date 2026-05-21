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
  CorvinaDeviceGetResponseOutput,
  CorvinaDeviceGetUrlVariablesOutput,
  CorvinaDevicePutRequestOutput,
  CorvinaDevicePutResponseOutput,
  CorvinaDevicePutUrlVariablesOutput,
} from "./definition";

export class CorvinaDeviceByIdRepository {
  private static buildPath(
    orgId: number | string,
    deviceId: number | string,
  ): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}`;
  }

  static async getById(
    urlPathParams: CorvinaDeviceGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaDeviceGetResponseOutput>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.deviceId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      ...result.data,
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });
  }

  static async update(
    urlPathParams: CorvinaDevicePutUrlVariablesOutput,
    data: CorvinaDevicePutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDevicePutResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaDevicePutResponseOutput>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.deviceId),
        body: {
          label: data.label,
          vpnEnabled: data.vpnEnabled,
          dataEnabled: data.dataEnabled,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device updated", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });
    return success({
      ...result.data,
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });
  }
}
