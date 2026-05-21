import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_PLATFORM_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  AvailableTagsResponseOutput,
  AvailableTagsUrlVariablesOutput,
} from "./definition";

interface RawTagEntry {
  name: string;
  type: string;
}

interface RawAvailableTagsResponse {
  data: string;
}

export class AvailableTagsRepository {
  private static availableTagsPath(
    orgId: number | string,
    deviceId: string,
  ): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/availableTags`;
  }

  static async getTags(
    urlPathParams: AvailableTagsUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AvailableTagsResponseOutput>> {
    const result = await CorvinaClient.request<RawAvailableTagsResponse>(
      {
        method: "GET",
        path: this.availableTagsPath(
          urlPathParams.orgId,
          urlPathParams.deviceId,
        ),
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    let tags: RawTagEntry[] = [];
    if (result.data?.data) {
      tags = JSON.parse(result.data.data) as RawTagEntry[];
    }

    return success({ tags });
  }
}
