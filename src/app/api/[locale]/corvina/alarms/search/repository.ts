import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  AlarmAction,
  AlarmOrderBy,
  AlarmOrderDir,
  AlarmStatus,
} from "../enums";
import type {
  AlarmSearchRequestOutput,
  AlarmSearchResponseOutput,
} from "./definition";

const ALARM_ORDER_BY_MAP: Record<
  (typeof AlarmOrderBy)[keyof typeof AlarmOrderBy],
  string
> = {
  [AlarmOrderBy.EVENT_TIMESTAMP]: "eventTimestamp",
  [AlarmOrderBy.UPDATED_AT]: "updatedAt",
  [AlarmOrderBy.SEVERITY]: "severity",
};

const ALARM_ORDER_DIR_MAP: Record<
  (typeof AlarmOrderDir)[keyof typeof AlarmOrderDir],
  string
> = {
  [AlarmOrderDir.ASC]: "asc",
  [AlarmOrderDir.DESC]: "desc",
};

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

interface RawAlarm {
  id: string;
  realmId?: string;
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

interface CorvinaAlarmSearchResponse {
  data: RawAlarm[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export class AlarmSearchRepository {
  static async search(
    data: AlarmSearchRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AlarmSearchResponseOutput>> {
    const orderByApi =
      data.orderBy !== undefined
        ? ALARM_ORDER_BY_MAP[data.orderBy]
        : "eventTimestamp";
    const orderDirApi =
      data.orderDir !== undefined ? ALARM_ORDER_DIR_MAP[data.orderDir] : "desc";

    const body: Record<string, string | number | boolean | string[]> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 20,
      orderBy: orderByApi ?? "eventTimestamp",
      orderDir: orderDirApi ?? "desc",
    };

    if (data.filter) {
      body["data"] = data.filter;
    }
    if (data.scopedOrganization) {
      body["scopedOrganization"] = data.scopedOrganization;
    }
    if (data.deviceName) {
      body["deviceName"] = data.deviceName;
    }
    if (data.deviceGroups) {
      body["deviceGroups"] = data.deviceGroups
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
    }

    const result = await CorvinaClient.request<CorvinaAlarmSearchResponse>(
      {
        method: "POST",
        path: "/api/v1/alarms/search",
        body,
        usePlatformApi: true,
      },
      logger,
      locale,
    );

    if (!result.success) {
      return result;
    }

    const alarms = result.data.data.map((raw) => ({
      id: raw.id,
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
      eventTimestamp: raw.eventTimestamp ? new Date(raw.eventTimestamp) : null,
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      orgResourceId: raw.orgResourceId ?? null,
    }));

    return success({
      alarms,
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }
}
