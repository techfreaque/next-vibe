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

interface CorvinaStatusEntry {
  deviceId: string;
  header: string[];
  data: (string | number | boolean | null)[][];
}

function parseLatestStatus(entries: CorvinaStatusEntry[]): {
  connected: boolean | null;
  lastSeenIp: string | null;
  lastConnection: Date | null;
  lastDisconnection: Date | null;
} {
  const entry = entries[0];
  if (!entry?.data.length) {
    return {
      connected: null,
      lastSeenIp: null,
      lastConnection: null,
      lastDisconnection: null,
    };
  }
  const lastRow = entry.data[entry.data.length - 1];
  const connIdx = entry.header.indexOf("connected");
  const ipIdx = entry.header.indexOf("ip");
  const tsIdx = entry.header.indexOf("timestamp");

  const connected =
    connIdx >= 0 ? ((lastRow[connIdx] as boolean) ?? null) : null;
  const lastSeenIp = ipIdx >= 0 ? ((lastRow[ipIdx] as string) ?? null) : null;
  const ts = tsIdx >= 0 ? ((lastRow[tsIdx] as number) ?? null) : null;
  const tsDate = ts !== null ? new Date(ts) : null;

  return {
    connected,
    lastSeenIp,
    lastConnection: connected === true ? tsDate : null,
    lastDisconnection: connected === false ? tsDate : null,
  };
}

function parseFirstRegistration(entries: CorvinaStatusEntry[]): Date | null {
  const entry = entries[0];
  if (!entry?.data.length) {
    return null;
  }
  const firstRow = entry.data[0];
  const tsIdx = entry.header.indexOf("timestamp");
  if (tsIdx < 0) {
    return null;
  }
  const ts = firstRow[tsIdx] as number | null;
  return ts !== null ? new Date(ts) : null;
}

export class CorvinaDeviceByIdRepository {
  private static buildPath(
    orgId: number | string,
    deviceId: number | string,
  ): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(deviceId)}`;
  }

  private static buildStatusPath(orgId: number | string, hwId: string): string {
    return `${CORVINA_PLATFORM_ORGS_PATH}/${encodeURIComponent(orgId)}/devices/${encodeURIComponent(hwId)}/status`;
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

    const [latestResult, firstResult] = await Promise.all([
      CorvinaClient.request<CorvinaStatusEntry[]>(
        {
          method: "GET",
          path: this.buildStatusPath(urlPathParams.orgId, d.hwId),
          usePlatformApi: true,
        },
        logger,
        locale,
      ),
      CorvinaClient.request<CorvinaStatusEntry[]>(
        {
          method: "GET",
          path: this.buildStatusPath(urlPathParams.orgId, d.hwId),
          query: { since: 0, limit: 1 },
          usePlatformApi: true,
        },
        logger,
        locale,
      ),
    ]);

    const { connected, lastSeenIp, lastConnection, lastDisconnection } =
      parseLatestStatus(latestResult.success ? latestResult.data : []);
    const firstRegistration = parseFirstRegistration(
      firstResult.success ? firstResult.data : [],
    );

    return success({
      orgId: urlPathParams.orgId,
      deviceId: urlPathParams.deviceId,
      label: d.label,
      hwId: d.hwId,
      orgResourceId: d.orgResourceId ?? null,
      groups: d.groups ?? [],
      connected,
      lastConnection,
      lastDisconnection,
      firstRegistration,
      lastSeenIp,
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
      groups: d.groups ?? [],
    });
  }
}
