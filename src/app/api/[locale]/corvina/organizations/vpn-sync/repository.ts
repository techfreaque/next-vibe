import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  OrganizationsVpnSyncRequestOutput,
  OrganizationsVpnSyncResponseOutput,
} from "./definition";

const CORVINA_ORGANIZATIONS_VPN_SYNC_PATH = "/api/v1/organizations/vpn/sync";

export class OrganizationsVpnSyncRepository {
  static async sync(
    data: OrganizationsVpnSyncRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<OrganizationsVpnSyncResponseOutput>> {
    const queryParams: Record<string, string> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      queryParams.orgResourceId = data.orgResourceId;
    }
    if (data.rootOrgResourceId !== undefined && data.rootOrgResourceId !== "") {
      queryParams.rootOrgResourceId = data.rootOrgResourceId;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const path = queryString
      ? `${CORVINA_ORGANIZATIONS_VPN_SYNC_PATH}?${queryString}`
      : CORVINA_ORGANIZATIONS_VPN_SYNC_PATH;

    const result = await CorvinaClient.request<string | null>(
      {
        method: "POST",
        path,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Organization VPN sync triggered");
    return success({ result: result.data });
  }
}
