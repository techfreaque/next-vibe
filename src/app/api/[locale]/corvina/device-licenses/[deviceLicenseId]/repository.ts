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
  DeviceLicenseDeleteRequestOutput,
  DeviceLicenseDeleteResponseOutput,
  DeviceLicenseDeleteUrlParamsOutput,
  DeviceLicenseUpdateRequestOutput,
  DeviceLicenseUpdateResponseOutput,
  DeviceLicenseUpdateUrlParamsOutput,
} from "./definition";

interface CorvinaDeviceLicenseDetailApiResponse {
  id: number;
  realm: string | null;
  logicalId: string | null;
  gatewayLogicalId: string | null;
  label: string | null;
  apiKey: string | null;
  platformPairingApiUrl: string | null;
  vpnPairingApiUrl: string | null;
  brokerUrls: string | null;
  orgResourceId: string | null;
  vpnKey: string | null;
  fromDateVpn: string | null;
  toDateVpn: string | null;
  numOfSecondsAutoRenewVpn: number | null;
  activationDate: string | null;
  vpnValidityMonths: number | null;
  vpnAccountingDisabled: boolean | null;
  serialNumber: string | null;
  activationKey: string;
  used: boolean;
  usedInTrial: boolean | null;
  deleted: boolean;
  clientName: string | null;
  notes: string | null;
  vpnOtpRequired: boolean | null;
  vpnPairingMode: string | null;
  vpnLastAttempt: string | null;
}

function mapCommonDateFields(raw: CorvinaDeviceLicenseDetailApiResponse): {
  id: number;
  realm: string | null;
  logicalId: string | null;
  gatewayLogicalId: string | null;
  label: string | null;
  apiKey: string | null;
  platformPairingApiUrl: string | null;
  vpnPairingApiUrl: string | null;
  brokerUrls: string | null;
  orgResourceId: string | null;
  vpnKey: string | null;
  fromDateVpn: Date | null;
  toDateVpn: Date | null;
  numOfSecondsAutoRenewVpn: number | null;
  activationDate: Date | null;
  activationKey: string;
  used: boolean;
  usedInTrial: boolean | null;
  deleted: boolean;
  vpnOtpRequired: boolean | null;
  vpnPairingMode: string | null;
  vpnLastAttempt: Date | null;
  deviceLicenseId: number;
} {
  return {
    id: raw.id,
    realm: raw.realm,
    logicalId: raw.logicalId,
    gatewayLogicalId: raw.gatewayLogicalId,
    label: raw.label,
    apiKey: raw.apiKey,
    platformPairingApiUrl: raw.platformPairingApiUrl,
    vpnPairingApiUrl: raw.vpnPairingApiUrl,
    brokerUrls: raw.brokerUrls,
    orgResourceId: raw.orgResourceId,
    vpnKey: raw.vpnKey,
    fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
    toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
    numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
    activationDate:
      raw.activationDate !== null ? new Date(raw.activationDate) : null,
    activationKey: raw.activationKey,
    used: raw.used,
    usedInTrial: raw.usedInTrial,
    deleted: raw.deleted,
    vpnOtpRequired: raw.vpnOtpRequired,
    vpnPairingMode: raw.vpnPairingMode,
    vpnLastAttempt:
      raw.vpnLastAttempt !== null ? new Date(raw.vpnLastAttempt) : null,
    deviceLicenseId: raw.id,
  };
}

function mapDeviceLicenseForUpdate(
  raw: CorvinaDeviceLicenseDetailApiResponse,
): DeviceLicenseUpdateResponseOutput {
  return {
    ...mapCommonDateFields(raw),
    serialNumber: raw.serialNumber ?? undefined,
    clientName: raw.clientName ?? undefined,
    notes: raw.notes ?? undefined,
    vpnValidityMonths: raw.vpnValidityMonths ?? undefined,
    vpnAccountingDisabled: raw.vpnAccountingDisabled ?? undefined,
  };
}

function mapDeviceLicenseForDelete(
  raw: CorvinaDeviceLicenseDetailApiResponse,
): DeviceLicenseDeleteResponseOutput {
  return {
    ...mapCommonDateFields(raw),
    serialNumber: raw.serialNumber,
    clientName: raw.clientName,
    notes: raw.notes,
    vpnValidityMonths: raw.vpnValidityMonths,
    vpnAccountingDisabled: raw.vpnAccountingDisabled,
  };
}

function buildPath(deviceLicenseId: number): string {
  return `/api/v1/deviceLicenses/${encodeURIComponent(deviceLicenseId)}`;
}

export class DeviceLicenseByIdRepository {
  static async update(
    urlPathParams: DeviceLicenseUpdateUrlParamsOutput,
    data: DeviceLicenseUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseUpdateResponseOutput>> {
    const body: CorvinaBodyObject = {};

    if (data.serialNumber !== undefined) {
      body.serialNumber = data.serialNumber;
    }
    if (data.clientName !== undefined) {
      body.clientName = data.clientName;
    }
    if (data.notes !== undefined) {
      body.notes = data.notes;
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

    const result =
      await CorvinaClient.request<CorvinaDeviceLicenseDetailApiResponse>(
        {
          method: "PUT",
          path: buildPath(urlPathParams.deviceLicenseId),
          body,
          service: "license",
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device license updated", {
      deviceLicenseId: urlPathParams.deviceLicenseId,
    });
    return success(mapDeviceLicenseForUpdate(result.data));
  }

  static async remove(
    urlPathParams: DeviceLicenseDeleteUrlParamsOutput,
    data: DeviceLicenseDeleteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseDeleteResponseOutput>> {
    const query: Record<string, string> = {};
    if (
      data.deleteOrgResourceId !== undefined &&
      data.deleteOrgResourceId !== ""
    ) {
      query.orgResourceId = data.deleteOrgResourceId;
    }

    const result =
      await CorvinaClient.request<CorvinaDeviceLicenseDetailApiResponse>(
        {
          method: "DELETE",
          path: buildPath(urlPathParams.deviceLicenseId),
          query,
          service: "license",
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Device license deleted", {
      deviceLicenseId: urlPathParams.deviceLicenseId,
    });
    return success(mapDeviceLicenseForDelete(result.data));
  }
}
