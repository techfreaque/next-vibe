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
  CorvinaDeviceTagsResponseOutput,
  CorvinaDeviceTagsUrlVariablesOutput,
} from "./definition";

export class CorvinaDeviceTagsRepository {
  private static buildPath(
    orgId: number | string,
    deviceId: number | string,
  ): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/tags`;
  }

  static async getTags(
    urlPathParams: CorvinaDeviceTagsUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceTagsResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaDeviceTagsResponseOutput>(
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
    return success(result.data);
  }
}
