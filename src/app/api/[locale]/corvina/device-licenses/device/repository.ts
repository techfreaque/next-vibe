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
  DeviceLicenseDeviceGetRequestOutput,
  DeviceLicenseDeviceGetResponseOutput,
  DeviceLicenseDevicePostRequestOutput,
  DeviceLicenseDevicePostResponseOutput,
} from "./definition";

interface CorvinaBaseDeviceLicenseApiResponse {
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
}

const CORVINA_DEVICE_LICENSES_DEVICE_PATH = "/api/v1/deviceLicenses/device";

function mapResponse(
  raw: CorvinaBaseDeviceLicenseApiResponse,
): DeviceLicenseDeviceGetResponseOutput {
  return {
    logicalId: raw.logicalId,
    realm: raw.realm,
    gatewayLogicalId: raw.gatewayLogicalId,
    label: raw.label,
    apiKey: raw.apiKey,
    orgResourceId: raw.orgResourceId,
    vpnKey: raw.vpnKey,
    fromDateVpn: raw.fromDateVpn !== null ? new Date(raw.fromDateVpn) : null,
    toDateVpn: raw.toDateVpn !== null ? new Date(raw.toDateVpn) : null,
    activationDate:
      raw.activationDate !== null ? new Date(raw.activationDate) : null,
    vpnValidityMonths: raw.vpnValidityMonths,
    numOfSecondsAutoRenewVpn: raw.numOfSecondsAutoRenewVpn,
    vpnAccountingDisabled: raw.vpnAccountingDisabled,
  };
}

export class DeviceLicenseDeviceRepository {
  static async getBySerialAndKey(
    data: DeviceLicenseDeviceGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseDeviceGetResponseOutput>> {
    const result =
      await CorvinaClient.request<CorvinaBaseDeviceLicenseApiResponse>(
        {
          method: "GET",
          path: CORVINA_DEVICE_LICENSES_DEVICE_PATH,
          query: {
            serialNumber: data.serialNumber,
            activationKey: data.activationKey,
          },
          service: "license",
        },
        logger,
        locale,
      );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device license fetched by serial and key");
    return success(mapResponse(result.data));
  }

  static async getByBody(
    data: DeviceLicenseDevicePostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseDevicePostResponseOutput>> {
    const body: CorvinaBodyObject = {
      activationKey: data.activationKey,
      serialNumber: data.serialNumber,
    };

    const result =
      await CorvinaClient.request<CorvinaBaseDeviceLicenseApiResponse>(
        {
          method: "POST",
          path: CORVINA_DEVICE_LICENSES_DEVICE_PATH,
          body,
          service: "license",
        },
        logger,
        locale,
      );

    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] Device license fetched by body");
    return success(mapResponse(result.data));
  }
}
