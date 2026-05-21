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
  DeviceUpdateRequestOutput,
  DeviceUpdateResponseOutput,
  DeviceUpdateUrlVariablesOutput,
} from "./definition";

interface RawDeviceUpdateResponse {
  id: number;
  label: string;
  hwId: string;
  orgResourceId: string | null;
}

export class DeviceUpdateRepository {
  private static devicePath(orgId: number | string, hwId: string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(hwId)}`;
  }

  static async update(
    urlPathParams: DeviceUpdateUrlVariablesOutput,
    data: DeviceUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceUpdateResponseOutput>> {
    const body: Record<string, string> = {};
    if (data.label !== undefined) {
      body["label"] = data.label;
    }
    if (data.description !== undefined) {
      body["description"] = data.description;
    }
    if (data.serialNumber !== undefined) {
      body["serialNumber"] = data.serialNumber;
    }

    const result = await CorvinaClient.request<RawDeviceUpdateResponse>(
      {
        method: "PATCH",
        path: this.devicePath(urlPathParams.orgId, urlPathParams.deviceId),
        body,
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
      id: result.data.id,
      labelResult: result.data.label,
      hwId: result.data.hwId,
      orgResourceId: result.data.orgResourceId,
    });
  }
}
