import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { AlarmAction, AlarmStatus } from "../enums";
import type {
  AlarmDetailResponseOutput,
  AlarmDetailUrlVariablesOutput,
} from "./definition";

const ALARM_STATUS_MAP: Record<
  string,
  (typeof AlarmStatus)[keyof typeof AlarmStatus]
> = {
  ACTIVE: AlarmStatus.ACTIVE,
  NOT_ACTIVE: AlarmStatus.NOT_ACTIVE,
};

const ALARM_ACTION_MAP: Record<
  string,
  (typeof AlarmAction)[keyof typeof AlarmAction]
> = {
  ACK: AlarmAction.ACK,
  NO_ACK: AlarmAction.NO_ACK,
};

interface RawAlarmDetail {
  id: string;
  realmId?: string | null;
  name: string;
  description?: string | null;
  deviceId?: string | null;
  tag?: string | null;
  severity?: number | null;
  updatedAt?: string | null;
  eventTimestamp?: string | null;
  acknowledgedDate?: string | null;
  orgResourceId?: string | null;
  status?: string | null;
  action?: string | null;
  alarmEnabled?: string | null;
  ack?: string | null;
  reset?: string | null;
  value_double?: number | null;
  value_integer?: number | null;
  value_boolean?: boolean | null;
  value_string?: string | null;
  user?: string | null;
  comment?: string | null;
  timestampAction?: string | null;
  platformAction?: string | null;
  deviceLabel?: string | null;
}

export class AlarmDetailRepository {
  static async getAlarm(
    urlPathParams: AlarmDetailUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AlarmDetailResponseOutput>> {
    const result = await CorvinaClient.request<RawAlarmDetail>(
      {
        method: "GET",
        path: `/api/v1/alarms/${encodeURIComponent(urlPathParams.alarmId)}`,
        usePlatformApi: true,
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    const raw = result.data;
    return success({
      alarmId: raw.id,
      name: raw.name,
      description: raw.description ?? null,
      deviceId: raw.deviceId ?? null,
      deviceLabel: raw.deviceLabel ?? null,
      tag: raw.tag ?? null,
      severity: raw.severity ?? null,
      status:
        raw.status !== null && raw.status !== undefined
          ? (ALARM_STATUS_MAP[raw.status] ?? null)
          : null,
      action:
        raw.action !== null && raw.action !== undefined
          ? (ALARM_ACTION_MAP[raw.action] ?? null)
          : null,
      alarmEnabled: raw.alarmEnabled ?? null,
      ack: raw.ack ?? null,
      reset: raw.reset ?? null,
      eventTimestamp: raw.eventTimestamp ?? null,
      updatedAt: raw.updatedAt ?? null,
      acknowledgedDate: raw.acknowledgedDate ?? null,
      orgResourceId: raw.orgResourceId ?? null,
      user: raw.user ?? null,
      comment: raw.comment ?? null,
      realmId: raw.realmId ?? null,
    });
  }
}
