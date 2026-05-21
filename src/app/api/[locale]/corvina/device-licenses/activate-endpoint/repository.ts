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
  DeviceLicenseActivateEndpointRequestOutput,
  DeviceLicenseActivateEndpointResponseOutput,
} from "./definition";

const CORVINA_DEVICE_LICENSES_ACTIVATE_ENDPOINT_PATH =
  "/api/v1/deviceLicenses/activate/endpoint";

interface CorvinaDeviceLicenseOut {
  id: number | null;
  logicalId: string;
  serialNumber: string | null;
  clientName: string | null;
  orgResourceId: string | null;
  activationKey: string | null;
  fromDateVpn: string | null;
  toDateVpn: string | null;
  activationDate: string | null;
  vpnValidityMonths: number | null;
  numOfSecondsAutoRenewVpn: number | null;
  used: boolean | null;
  deleted: boolean | null;
}

export class DeviceLicenseActivateEndpointRepository {
  static async create(
    data: DeviceLicenseActivateEndpointRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseActivateEndpointResponseOutput>> {
    const body: CorvinaBodyObject = {
      activationKey: data.activationKey,
      alias: data.alias,
    };

    if (
      data.deviceSerialNumber !== undefined &&
      data.deviceSerialNumber !== ""
    ) {
      body.deviceSerialNumber = data.deviceSerialNumber;
    }
    if (
      data.endpointDescription !== undefined &&
      data.endpointDescription !== ""
    ) {
      body.description = data.endpointDescription;
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
    if (data.gatewayId !== undefined && data.gatewayId !== "") {
      body.gatewayId = data.gatewayId;
    }

    const result = await CorvinaClient.request<CorvinaDeviceLicenseOut>(
      {
        method: "POST",
        path: CORVINA_DEVICE_LICENSES_ACTIVATE_ENDPOINT_PATH,
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
    logger.info("[CORVINA] Device license endpoint activated", {
      activationKey: data.activationKey,
      alias: data.alias,
    });
    return success({
      logicalIdOut: raw.logicalId,
      id: raw.id,
      serialNumber: raw.serialNumber,
      clientName: raw.clientName,
      activationKeyOut: raw.activationKey,
      fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
      toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
      activationDate:
        raw.activationDate !== null ? new Date(raw.activationDate) : null,
      vpnValidityMonths: raw.vpnValidityMonths,
      numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
      used: raw.used,
      deleted: raw.deleted,
    });
  }
}
