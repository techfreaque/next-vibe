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
  DeviceLicenseActivateRequestOutput,
  DeviceLicenseActivateResponseOutput,
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

export class DeviceLicenseActivateRepository {
  static async activate(
    data: DeviceLicenseActivateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseActivateResponseOutput>> {
    const body: CorvinaBodyObject = {
      activationKey: data.activationKey,
    };

    if (data.alias !== undefined && data.alias !== "") {
      body.alias = data.alias;
    }
    if (
      data.deviceSerialNumber !== undefined &&
      data.deviceSerialNumber !== ""
    ) {
      body.deviceSerialNumber = data.deviceSerialNumber;
    }
    if (
      data.activateDescription !== undefined &&
      data.activateDescription !== ""
    ) {
      body.description = data.activateDescription;
    }
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      body.orgResourceId = data.orgResourceId;
    }
    if (data.logicalId !== undefined && data.logicalId !== "") {
      body.logicalId = data.logicalId;
    }
    if (data.numOfSecondsVpn !== undefined) {
      body.numOfSecondsVpn = data.numOfSecondsVpn;
    }
    if (data.autorenewVpn !== undefined) {
      body.autorenewVpn = data.autorenewVpn;
    }

    const result =
      await CorvinaClient.request<CorvinaDeviceLicenseDetailApiResponse>(
        {
          method: "POST",
          path: "/api/v1/deviceLicenses/activate",
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

    return success({
      id: raw.id,
      realm: raw.realm,
      logicalIdOut: raw.logicalId,
      gatewayLogicalId: raw.gatewayLogicalId,
      label: raw.label,
      apiKey: raw.apiKey,
      platformPairingApiUrl: raw.platformPairingApiUrl,
      vpnPairingApiUrl: raw.vpnPairingApiUrl,
      brokerUrls: raw.brokerUrls,
      orgResourceIdOut: raw.orgResourceId,
      vpnKey: raw.vpnKey,
      fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
      toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
      numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
      activationDate:
        raw.activationDate !== null ? new Date(raw.activationDate) : null,
      vpnValidityMonths: raw.vpnValidityMonths,
      vpnAccountingDisabled: raw.vpnAccountingDisabled,
      serialNumber: raw.serialNumber,
      activationKeyOut: raw.activationKey,
      used: raw.used,
      usedInTrial: raw.usedInTrial,
      deleted: raw.deleted,
      clientName: raw.clientName,
      notes: raw.notes,
      vpnOtpRequired: raw.vpnOtpRequired,
      vpnPairingMode: raw.vpnPairingMode,
      vpnLastAttempt:
        raw.vpnLastAttempt !== null ? new Date(raw.vpnLastAttempt) : null,
    });
  }
}
