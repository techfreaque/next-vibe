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
  DeviceLicenseVpnActivateRequestOutput,
  DeviceLicenseVpnActivateResponseOutput,
} from "./definition";

const CORVINA_DEVICE_LICENSES_VPN_ACTIVATE_PATH =
  "/api/v1/deviceLicenses/vpn/activate";

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

export class DeviceLicenseVpnActivateRepository {
  static async create(
    data: DeviceLicenseVpnActivateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseVpnActivateResponseOutput>> {
    const body: CorvinaBodyObject = {
      logicalId: data.logicalId,
      numOfSeconds: data.numOfSeconds,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      body.orgResourceId = data.orgResourceId;
    }
    if (data.autorenew !== undefined) {
      body.autorenew = data.autorenew;
    }

    const result = await CorvinaClient.request<CorvinaDeviceLicenseOut>(
      {
        method: "POST",
        path: CORVINA_DEVICE_LICENSES_VPN_ACTIVATE_PATH,
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
    logger.info("[CORVINA] Device license VPN activated", {
      logicalId: data.logicalId,
    });
    return success({
      logicalId: raw.logicalId,
      id: raw.id,
      serialNumber: raw.serialNumber,
      clientName: raw.clientName,
      activationKey: raw.activationKey,
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
