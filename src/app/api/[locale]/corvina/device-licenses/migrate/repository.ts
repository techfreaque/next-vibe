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
  DeviceLicenseMigrateRequestOutput,
  DeviceLicenseMigrateResponseOutput,
} from "./definition";

const CORVINA_DEVICE_LICENSES_MIGRATE_PATH = "/api/v1/deviceLicenses/migrate";

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

export class DeviceLicenseMigrateRepository {
  static async create(
    data: DeviceLicenseMigrateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<DeviceLicenseMigrateResponseOutput>> {
    const body: CorvinaBodyObject = {
      oldActivationKeyId: data.oldActivationKeyId,
      newRealm: data.newRealm,
    };

    const result = await CorvinaClient.request<CorvinaDeviceLicenseOut>(
      {
        method: "POST",
        path: CORVINA_DEVICE_LICENSES_MIGRATE_PATH,
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
    logger.info("[CORVINA] Device license migrated", {
      oldActivationKeyId: data.oldActivationKeyId,
      newRealm: data.newRealm,
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
