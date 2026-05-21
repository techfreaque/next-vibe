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
  DeviceMoveRequestOutput,
  DeviceMoveResponseOutput,
  DeviceMoveUrlVariablesOutput,
} from "./definition";

interface RawDeviceMoveResponse {
  id: number;
  label: string;
  hwId: string;
  orgResourceId: string | null;
}

export class DeviceMoveRepository {
  private static deviceMovePath(orgId: number | string, hwId: string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(hwId)}/move`;
  }

  static async move(
    urlPathParams: DeviceMoveUrlVariablesOutput,
    data: DeviceMoveRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceMoveResponseOutput>> {
    const result = await CorvinaClient.request<RawDeviceMoveResponse>(
      {
        method: "POST",
        path: this.deviceMovePath(urlPathParams.orgId, urlPathParams.deviceId),
        body: { organizationImportToken: data.organizationImportToken },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device moved", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
    });

    return success({
      id: result.data.id,
      labelResult: result.data.label,
      hwId: result.data.hwId,
      orgResourceId: result.data.orgResourceId,
    });
  }
}
