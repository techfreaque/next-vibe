import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { AlarmActionType } from "../enums";
import type {
  AlarmActionRequestOutput,
  AlarmActionResponseOutput,
} from "./definition";

const ACTION_PATH_MAP: Record<
  (typeof AlarmActionType)[keyof typeof AlarmActionType],
  string
> = {
  [AlarmActionType.ACK]: "/api/v1/alarms/action/ack",
  [AlarmActionType.RESET]: "/api/v1/alarms/action/reset",
  [AlarmActionType.CLEAR]: "/api/v1/alarms/action/clear",
};

export class AlarmActionRepository {
  static async performAction(
    data: AlarmActionRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AlarmActionResponseOutput>> {
    const path = ACTION_PATH_MAP[data.type];

    const body: Record<string, string> = {
      id: data.alarmId,
    };
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

    logger.info("[CORVINA] Alarm action performed", {
      alarmId: data.alarmId,
      type: data.type,
    });

    return success({
      success: true,
      message: `Alarm ${data.type} executed.`,
    });
  }
}
