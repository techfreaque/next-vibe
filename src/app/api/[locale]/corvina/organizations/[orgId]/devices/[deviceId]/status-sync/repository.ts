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
  StatusSyncResponseOutput,
  StatusSyncUrlVariablesOutput,
} from "./definition";

export class StatusSyncRepository {
  private static statusSyncPath(
    orgId: number | string,
    deviceId: string,
  ): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/status/sync`;
  }

  static async sync(
    urlPathParams: StatusSyncUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<StatusSyncResponseOutput>> {
    const result = await CorvinaClient.request<undefined>(
      {
        method: "GET",
        path: this.statusSyncPath(urlPathParams.orgId, urlPathParams.deviceId),
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device status sync triggered", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });

    return success({ message: "Status sync triggered." });
  }
}
