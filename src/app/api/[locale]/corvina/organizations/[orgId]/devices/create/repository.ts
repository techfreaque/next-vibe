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
  CorvinaDeviceCreateRequestOutput,
  CorvinaDeviceCreateResponseOutput,
  CorvinaDeviceCreateUrlVariablesOutput,
} from "./definition";

export class CorvinaDeviceCreateRepository {
  private static buildPath(orgId: number | string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices`;
  }

  static async create(
    urlPathParams: CorvinaDeviceCreateUrlVariablesOutput,
    data: CorvinaDeviceCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceCreateResponseOutput>> {
    const result =
      await CorvinaClient.request<CorvinaDeviceCreateResponseOutput>(
        {
          method: "POST",
          path: this.buildPath(urlPathParams.orgId),
          body: {
            name: data.name,
            ...(data.label ? { label: data.label } : {}),
          },
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device created", {
      orgId: urlPathParams.orgId,
      deviceId: result.data.deviceId,
    });
    return success(result.data);
  }
}
