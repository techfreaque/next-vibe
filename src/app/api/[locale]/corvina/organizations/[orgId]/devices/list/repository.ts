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
}

export class CorvinaDevicesListRepository {
  private static buildPath(orgId: number | string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices`;
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
    return success({
      devices: result.data.content.map((d) => ({
        id: d.id,
        label: d.label,
        hwId: d.hwId,
        orgResourceId: d.orgResourceId ?? null,
        groups: d.groups ?? [],
      })),
      total: result.data.totalElements,
    });
  }
}
