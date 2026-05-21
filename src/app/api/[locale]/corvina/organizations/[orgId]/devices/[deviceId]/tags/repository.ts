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
  CorvinaDeviceTagsResponseOutput,
  CorvinaDeviceTagsUrlVariablesOutput,
  CorvinaDeviceTagsWriteRequestOutput,
  CorvinaDeviceTagsWriteResponseOutput,
  CorvinaDeviceTagsWriteUrlVariablesOutput,
} from "./definition";

interface TagDataValues {
  deviceId: string;
  modelPath: string;
  types: string[];
  header: string[];
  data: (string | number | null)[][];
}

export class CorvinaDeviceTagsRepository {
  private static tagsPath(orgId: number | string, deviceId: string): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/tags`;
  }

  static async getTags(
    urlPathParams: CorvinaDeviceTagsUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceTagsResponseOutput>> {
    const result = await CorvinaClient.request<TagDataValues[]>(
      {
        method: "POST",
        path: `${this.tagsPath(urlPathParams.orgId, urlPathParams.deviceId)}/query`,
        body: { modelPath: "**" },
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const tagRows = result.data.map((tv) => {
      const lastRow = tv.data[tv.data.length - 1];
      const valueIndex = tv.header.indexOf("value");
      const tsIndex = tv.header.indexOf("timestamp");
      const latestValue =
        lastRow !== null && lastRow !== undefined && valueIndex >= 0
          ? String(lastRow[valueIndex] ?? "")
          : null;
      const latestTimestampRaw =
        lastRow !== null && lastRow !== undefined && tsIndex >= 0
          ? (lastRow[tsIndex] as number | null)
          : null;
      const latestTimestamp =
        latestTimestampRaw !== null ? new Date(latestTimestampRaw) : null;
      return { modelPath: tv.modelPath, latestValue, latestTimestamp };
    });
    return success({ tags: tagRows, total: tagRows.length });
  }

  static async setTagValue(
    urlPathParams: CorvinaDeviceTagsWriteUrlVariablesOutput,
    data: CorvinaDeviceTagsWriteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaDeviceTagsWriteResponseOutput>> {
    const numericV = Number(data.v);
    const v: string | number = isNaN(numericV) ? data.v : numericV;

    const result = await CorvinaClient.request<undefined>(
      {
        method: "POST",
        path: this.tagsPath(urlPathParams.orgId, urlPathParams.deviceId),
        body: { data: [{ modelPath: data.modelPath, v }] },
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Tag value set", {
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      modelPath: data.modelPath,
    });
    return success({ message: "Tag value updated." });
  }
}
