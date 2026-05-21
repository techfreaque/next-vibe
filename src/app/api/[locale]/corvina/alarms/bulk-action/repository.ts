import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { BulkAlarmActionType } from "../enums";
import type {
  BulkAlarmActionRequestOutput,
  BulkAlarmActionResponseOutput,
} from "./definition";

const BULK_ACTION_PATH_MAP: Record<
  (typeof BulkAlarmActionType)[keyof typeof BulkAlarmActionType],
  string
> = {
  [BulkAlarmActionType.ACK_ALL]: "/api/v1/alarms/action/ackAll",
  [BulkAlarmActionType.RESET_ALL]: "/api/v1/alarms/action/resetAll",
  [BulkAlarmActionType.CLEAR_ALL]: "/api/v1/alarms/action/clearAll",
};

export class BulkAlarmActionRepository {
  static async performBulkAction(
    data: BulkAlarmActionRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BulkAlarmActionResponseOutput>> {
    const path = BULK_ACTION_PATH_MAP[data.type];

    const body: Record<string, string> = {};
    if (data.filter) {
      body["data"] = data.filter;
    }
    if (data.scopedOrganization) {
      body["scopedOrganization"] = data.scopedOrganization;
    }
    if (data.deviceName) {
      body["deviceName"] = data.deviceName;
    }
    if (data.comment) {
      body["comment"] = data.comment;
    }

    const result = await CorvinaClient.request<undefined>(
      {
        method: "POST",
        path,
        body,
        usePlatformApi: true,
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Bulk alarm action performed", { type: data.type });

    return success({
      success: true,
      message: `Bulk action ${data.type} executed.`,
    });
  }
}
