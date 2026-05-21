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
  CorvinaDeviceGetResponseOutput,
  CorvinaDeviceGetUrlVariablesOutput,
  CorvinaDevicePatchRequestOutput,
  CorvinaDevicePatchResponseOutput,
  CorvinaDevicePatchUrlVariablesOutput,
} from "./definition";

interface CorvinaDeviceApiData {
  id: number;
  label: string;
  hwId: string;
  orgResourceId?: string;
  groups?: string[];
}

export class CorvinaDeviceByIdRepository {
  private static buildPath(
    orgId: number | string,
    deviceId: number | string,
  ): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}`;
  }

  static async getById(
    urlPathParams: CorvinaDeviceGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaDeviceApiData>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.deviceId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const d = result.data;
    return success({
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      label: d.label,
      hwId: d.hwId,
      orgResourceId: d.orgResourceId ?? null,
    });
  }

  static async update(
    urlPathParams: CorvinaDevicePatchUrlVariablesOutput,
    data: CorvinaDevicePatchRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDevicePatchResponseOutput>> {
    const body: Record<string, string> = {};
    if (data.label) {
      body.label = data.label;
    }
    if (data.description) {
      body.description = data.description;
    }
    if (data.serialNumber) {
      body.serialNumber = data.serialNumber;
    }

    const result = await CorvinaClient.request<CorvinaDeviceApiData>(
      {
        method: "PATCH",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.deviceId),
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
    const d = result.data;
    return success({
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      label: d.label,
      hwId: d.hwId,
      orgResourceId: d.orgResourceId ?? null,
    });
  }
}
