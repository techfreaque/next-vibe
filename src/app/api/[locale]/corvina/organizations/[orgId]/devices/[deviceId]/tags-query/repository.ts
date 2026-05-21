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
  TagQueryRequestOutput,
  TagQueryResponseOutput,
  TagQueryUrlVariablesOutput,
} from "./definition";

interface TagDataValues {
  deviceId: string;
  modelPath: string;
  types: string[];
  header: string[];
  data: (string | number | null)[][];
}

export class TagQueryRepository {
  private static tagsQueryPath(
    orgId: number | string,
    deviceId: string,
  ): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}/tags/query`;
  }

  static async query(
    urlPathParams: TagQueryUrlVariablesOutput,
    data: TagQueryRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<TagQueryResponseOutput>> {
    const body: Record<string, string | number> = {};
    if (data.modelPath !== undefined) {
      body["modelPath"] = data.modelPath;
    }
    if (data.since !== undefined) {
      body["since"] = data.since;
    }
    if (data.to !== undefined) {
      body["to"] = data.to;
    }
    if (data.limit !== undefined) {
      body["limit"] = data.limit;
    }
    if (data.mode !== undefined) {
      body["mode"] = data.mode;
    }
    if (data.filterCondition !== undefined) {
      body["filterCondition"] = data.filterCondition;
    }

    const result = await CorvinaClient.request<TagDataValues[]>(
      {
        method: "POST",
        path: this.tagsQueryPath(urlPathParams.orgId, urlPathParams.deviceId),
        body,
        usePlatformApi: true,
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    const rawData = result.data ?? [];
    const results = rawData.map((tv) => {
      const lastRow = tv.data[tv.data.length - 1];
      const valueIndex = tv.header.indexOf("value");
      const tsIndex = tv.header.indexOf("timestamp");
      const latestValue =
        lastRow !== null && lastRow !== undefined && valueIndex >= 0
          ? String(lastRow[valueIndex] ?? "")
          : null;
      const rawTs =
        lastRow !== null && lastRow !== undefined && tsIndex >= 0
          ? lastRow[tsIndex]
          : null;
      const latestTimestamp =
        rawTs !== null && rawTs !== undefined
          ? new Date(rawTs as number)
          : null;
      return {
        deviceId: tv.deviceId,
        modelPath: tv.modelPath,
        rowCount: tv.data.length,
        latestValue,
        latestTimestamp,
      };
    });

    return success({ results });
  }
}
