import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CorvinaDeviceDeleteUrlVariablesOutput } from "./definition";

export class CorvinaDeviceDeleteRepository {
  static async deleteDevice(
    urlPathParams: CorvinaDeviceDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/devices/${encodeURIComponent(urlPathParams.deviceId)}`;
    const result = await CorvinaClient.request<void>(
      { method: "DELETE", path },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device deleted", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });
    return success();
  }
}
