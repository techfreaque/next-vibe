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
  DeviceStatusResponseOutput,
  DeviceStatusUrlVariablesOutput,
} from "./definition";

interface RawStatusEvent {
  device_ip_address?: string;
  type?: string;
}

interface RawStatusResponse {
  event?: Record<string, RawStatusEvent>;
  connected?: boolean;
  lastSeen?: number | null;
}

function extractIpAddress(raw: RawStatusResponse): string | null {
  if (raw.event) {
    for (const eventData of Object.values(raw.event)) {
      if (eventData.device_ip_address) {
        return eventData.device_ip_address;
      }
    }
  }
  return null;
}

export class DeviceStatusRepository {
  static async get(
    urlPathParams: DeviceStatusUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceStatusResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/devices/${encodeURIComponent(urlPathParams.deviceId)}/status`;
    const result = await CorvinaClient.request<RawStatusResponse>(
      { method: "GET", path, usePlatformApi: true },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      connected: result.data.connected ?? false,
      lastSeen: result.data.lastSeen ?? null,
      ipAddress: extractIpAddress(result.data),
    });
  }
}
