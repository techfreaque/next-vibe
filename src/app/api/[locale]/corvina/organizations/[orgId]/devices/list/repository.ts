import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CORVINA_PLATFORM_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CorvinaDevicesListResponseOutput,
  CorvinaDevicesListUrlVariablesOutput,
} from "./definition";

interface CorvinaDeviceApiItem {
  id: number;
  label: string;
  hwId: string;
  orgResourceId?: string;
  groups?: string[];
}

interface CorvinaDevicesPageResponse {
  content: CorvinaDeviceApiItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

interface CorvinaStatusEntry {
  deviceId: string;
  header: string[];
  data: (string | number | boolean | null)[][];
}

export class CorvinaDevicesListRepository {
  private static buildPath(orgId: number | string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices`;
  }

  private static buildStatusPath(orgId: number | string, hwId: string): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(hwId)}/status`;
  }

  static async list(
    urlPathParams: CorvinaDevicesListUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDevicesListResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaDevicesPageResponse>(
      { method: "GET", path: this.buildPath(urlPathParams.orgId) },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const devices = result.data.content;

    const statusResults = await Promise.all(
      devices.map((d) =>
        CorvinaClient.request<CorvinaStatusEntry[]>(
          {
            method: "GET",
            path: this.buildStatusPath(urlPathParams.orgId, d.hwId),
            usePlatformApi: true,
          },
          logger,
          locale,
        ),
      ),
    );

    return success({
      devices: devices.map((d, i) => {
        const statusResult = statusResults[i];
        const entry =
          statusResult?.success === true ? statusResult.data[0] : undefined;
        const lastRow = entry?.data[entry.data.length - 1];
        const connIdx = entry?.header.indexOf("connected") ?? -1;
        const connected =
          lastRow !== undefined && connIdx >= 0
            ? ((lastRow[connIdx] as boolean) ?? null)
            : null;
        return {
          id: d.id,
          label: d.label,
          hwId: d.hwId,
          orgResourceId: d.orgResourceId ?? null,
          groups: d.groups ?? [],
          connected,
        };
      }),
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
    });
  }
}
