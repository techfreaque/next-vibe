import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CorvinaOrganizationGetResponseOutput,
  CorvinaOrganizationGetUrlVariablesOutput,
  CorvinaOrganizationPutRequestOutput,
  CorvinaOrganizationPutResponseOutput,
  CorvinaOrganizationPutUrlVariablesOutput,
} from "./definition";

export class CorvinaOrganizationByIdRepository {
  private static buildPath(orgId: number | string): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}`;
  }

  static async getById(
    urlPathParams: CorvinaOrganizationGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrganizationGetResponseOutput>> {
    const result =
      await CorvinaClient.request<CorvinaOrganizationGetResponseOutput>(
        { method: "GET", path: this.buildPath(urlPathParams.orgId) },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    return success({ ...result.data, orgId: urlPathParams.orgId });
  }

  static async update(
    urlPathParams: CorvinaOrganizationPutUrlVariablesOutput,
    data: CorvinaOrganizationPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrganizationPutResponseOutput>> {
    const result =
      await CorvinaClient.request<CorvinaOrganizationPutResponseOutput>(
        {
          method: "PUT",
          path: this.buildPath(urlPathParams.orgId),
          body: {
            label: data.label,
            privateAccess: data.privateAccess,
            allowDisablePrivateAccess: data.allowDisablePrivateAccess,
            allowHostname: data.allowHostname,
            dataEnabled: data.dataEnabled,
            vpnEnabled: data.vpnEnabled,
            storeEnabled: data.storeEnabled,
            mfaRequired: data.mfaRequired,
            ...(data.hostname ? { hostname: data.hostname } : {}),
            ...(data.ipAddressesWhitelist
              ? { ipAddressesWhitelist: data.ipAddressesWhitelist }
              : {}),
          },
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Organization updated", {
      orgId: urlPathParams.orgId,
    });
    return success({ ...result.data, orgId: urlPathParams.orgId });
  }
}
