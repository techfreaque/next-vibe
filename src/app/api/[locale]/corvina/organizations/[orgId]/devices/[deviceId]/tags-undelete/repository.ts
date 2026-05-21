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
  TagsUndeleteRequestOutput,
  TagsUndeleteResponseOutput,
  TagsUndeleteUrlVariablesOutput,
} from "./definition";

export class TagsUndeleteRepository {
  private static tagsUndeletePath(
    orgId: number | string,
    deviceId: string,
  ): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/tags/undelete`;
  }

  static async undeleteTags(
    urlPathParams: TagsUndeleteUrlVariablesOutput,
    data: TagsUndeleteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TagsUndeleteResponseOutput>> {
    const body: Record<string, string> = {};
    if (data.modelPath !== undefined) {
      body["modelPath"] = data.modelPath;
    }
    if (data.since !== undefined) {
      body["since"] = data.since;
    }
    if (data.to !== undefined) {
      body["to"] = data.to;
    }
    if (data.filterCondition !== undefined) {
      body["filterCondition"] = data.filterCondition;
    }

    const result = await CorvinaClient.request<number>(
      {
        method: "POST",
        path: this.tagsUndeletePath(
          urlPathParams.orgId,
          urlPathParams.deviceId,
        ),
        body,
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device tags undeleted", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      undeletedCount: result.data,
    });

    return success({ undeletedCount: result.data ?? 0 });
  }
}
