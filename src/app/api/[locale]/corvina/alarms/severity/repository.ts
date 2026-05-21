import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  AlarmSeverityRequestOutput,
  AlarmSeverityResponseOutput,
} from "./definition";

interface SeverityCountData {
  count: number;
  severity: number;
}

interface CorvinaSeverityCountResponse {
  data: SeverityCountData[];
}

export class AlarmSeverityRepository {
  static async getSeverityCounts(
    data: AlarmSeverityRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AlarmSeverityResponseOutput>> {
    const body: Record<string, string> = {};
    if (data.scopedOrganization) {
      body["scopedOrganization"] = data.scopedOrganization;
    }
    if (data.deviceName) {
      body["deviceName"] = data.deviceName;
    }

    const result = await CorvinaClient.request<CorvinaSeverityCountResponse>(
      {
        method: "POST",
        path: "/api/v1/alarms/severityCount",
        body,
        usePlatformApi: true,
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    return success({
      data: (result.data.data ?? []).map((item) => ({
        count: item.count,
        severity: item.severity,
      })),
    });
  }
}
