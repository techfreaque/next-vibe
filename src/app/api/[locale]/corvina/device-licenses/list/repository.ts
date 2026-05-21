import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  DeviceLicenseCreateRequestOutput,
  DeviceLicenseCreateResponseOutput,
  DeviceLicensesListRequestOutput,
  DeviceLicensesListResponseOutput,
} from "./definition";

const CORVINA_DEVICE_LICENSES_PATH = "/api/v1/deviceLicenses";

interface CorvinaDeviceLicenseApiResponse {
  id: number;
  serialNumber: string | null;
  activationKey: string;
  realm: string | null;
  logicalId: string | null;
  gatewayLogicalId: string | null;
  label: string | null;
  apiKey: string | null;
  orgResourceId: string | null;
  vpnKey: string | null;
  fromDateVpn: string | null;
  toDateVpn: string | null;
  numOfSecondsAutoRenewVpn: number | null;
  activationDate: string | null;
  vpnValidityMonths: number | null;
  vpnEnabled: boolean | null;
  used: boolean;
  deleted: boolean;
  clientName: string | null;
  notes: string | null;
}

interface CorvinaDeviceLicensesPageResponse {
  content: CorvinaDeviceLicenseApiResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
}

function mapDeviceLicense(
  raw: CorvinaDeviceLicenseApiResponse,
): DeviceLicensesListResponseOutput["deviceLicenses"][number] {
  return {
    id: raw.id,
    serialNumber: raw.serialNumber,
    realm: raw.realm,
    logicalId: raw.logicalId,
    label: raw.label,
    apiKey: raw.apiKey,
    orgResourceId: raw.orgResourceId,
    vpnKey: raw.vpnKey,
    fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
    toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
    numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
    activationDate:
      raw.activationDate !== null ? new Date(raw.activationDate) : null,
    used: raw.used,
    deleted: raw.deleted,
    activationKey: raw.activationKey,
    clientName: raw.clientName,
    notes: raw.notes,
    vpnEnabled: raw.vpnEnabled,
    vpnValidityMonths: raw.vpnValidityMonths,
  };
}

export class DeviceLicensesRepository {
  static async list(
    data: DeviceLicensesListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicensesListResponseOutput>> {
    const query: Record<string, string | number> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result =
      await CorvinaClient.request<CorvinaDeviceLicensesPageResponse>(
        {
          method: "GET",
          path: CORVINA_DEVICE_LICENSES_PATH,
          query,
          service: "license",
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    return success({
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
      deviceLicenses: result.data.content.map(mapDeviceLicense),
    });
  }

  static async create(
    data: DeviceLicenseCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseCreateResponseOutput>> {
    const body: CorvinaBodyObject = {
      activationKey: data.activationKey,
    };

    if (data.serialNumber !== undefined && data.serialNumber !== "") {
      body.serialNumber = data.serialNumber;
    }
    if (data.clientName !== undefined && data.clientName !== "") {
      body.clientName = data.clientName;
    }
    if (data.notes !== undefined && data.notes !== "") {
      body.notes = data.notes;
    }
    if (data.vpnEnabled !== undefined) {
      body.vpnEnabled = data.vpnEnabled;
    }
    if (data.dataEnabled !== undefined) {
      body.dataEnabled = data.dataEnabled;
    }
    if (data.vpnStartDate !== undefined) {
      body.vpnStartDate =
        data.vpnStartDate instanceof Date
          ? data.vpnStartDate.toISOString()
          : String(data.vpnStartDate);
    }
    if (data.vpnEndDate !== undefined) {
      body.vpnEndDate =
        data.vpnEndDate instanceof Date
          ? data.vpnEndDate.toISOString()
          : String(data.vpnEndDate);
    }
    if (data.vpnValidityMonths !== undefined) {
      body.vpnValidityMonths = data.vpnValidityMonths;
    }
    if (data.vpnAccountingDisabled !== undefined) {
      body.vpnAccountingDisabled = data.vpnAccountingDisabled;
    }

    const result = await CorvinaClient.request<CorvinaDeviceLicenseApiResponse>(
      {
        method: "POST",
        path: CORVINA_DEVICE_LICENSES_PATH,
        body,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    const raw = result.data;
    logger.info("[CORVINA] Device license created", {
      id: raw.id,
      activationKey: raw.activationKey,
    });

    return success({
      id: raw.id,
      serialNumberOut: raw.serialNumber,
      activationKey: raw.activationKey,
      realm: raw.realm,
      logicalId: raw.logicalId,
      label: raw.label,
      apiKey: raw.apiKey,
      orgResourceId: raw.orgResourceId,
      vpnKey: raw.vpnKey,
      fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
      toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
      numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
      activationDate:
        raw.activationDate !== null ? new Date(raw.activationDate) : null,
      used: raw.used,
      deleted: raw.deleted,
      clientName: raw.clientName ?? undefined,
      notes: raw.notes ?? undefined,
      vpnEnabled: raw.vpnEnabled ?? undefined,
      vpnValidityMonths: raw.vpnValidityMonths ?? undefined,
    });
  }
}
