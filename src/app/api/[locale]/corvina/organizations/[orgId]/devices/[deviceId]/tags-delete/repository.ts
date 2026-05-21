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
  TagsDeleteRequestOutput,
  TagsDeleteResponseOutput,
  TagsDeleteUrlVariablesOutput,
} from "./definition";

export class TagsDeleteRepository {
  private static tagsPath(orgId: number | string, deviceId: string): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/tags`;
  }

  static async deleteTags(
    urlPathParams: TagsDeleteUrlVariablesOutput,
    data: TagsDeleteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TagsDeleteResponseOutput>> {
    const query: Record<string, string> = {};
    if (data.modelPath !== undefined) {
      query["modelPath"] = data.modelPath;
    }
    if (data.since !== undefined) {
      query["since"] = data.since;
    }
    if (data.to !== undefined) {
      query["to"] = data.to;
    }
    if (data.filterCondition !== undefined) {
      query["filterCondition"] = data.filterCondition;
    }

    const result = await CorvinaClient.request<number>(
      {
        method: "DELETE",
        path: this.tagsPath(urlPathParams.orgId, urlPathParams.deviceId),
        query,
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device tags deleted", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      deletedCount: result.data,
    });

    return success({ deletedCount: result.data ?? 0 });
  }
}
