import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  OrganizationsVpnSyncAsyncRequestOutput,
  OrganizationsVpnSyncAsyncResponseOutput,
} from "./definition";

const CORVINA_ORGANIZATIONS_VPN_SYNC_ASYNC_PATH =
  "/api/v1/organizations/vpn/sync/async";

interface CorvinaSyncVpnJob {
  id: string | null;
  orgResourceId: string | null;
  rootOrgResourceId: string | null;
  status: string | null;
  error: string | null;
}

export class OrganizationsVpnSyncAsyncRepository {
  static async sync(
    data: OrganizationsVpnSyncAsyncRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<OrganizationsVpnSyncAsyncResponseOutput>> {
    const queryParams: Record<string, string> = {};
    if (
      data.orgResourceId !== undefined &&
      data.orgResourceId !== null &&
      data.orgResourceId !== ""
    ) {
      queryParams.orgResourceId = data.orgResourceId;
    }
    if (
      data.rootOrgResourceId !== undefined &&
      data.rootOrgResourceId !== null &&
      data.rootOrgResourceId !== ""
    ) {
      queryParams.rootOrgResourceId = data.rootOrgResourceId;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const path = queryString
      ? `${CORVINA_ORGANIZATIONS_VPN_SYNC_ASYNC_PATH}?${queryString}`
      : CORVINA_ORGANIZATIONS_VPN_SYNC_ASYNC_PATH;

    const result = await CorvinaClient.request<CorvinaSyncVpnJob>(
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
    const raw = result.data;
    logger.info("[CORVINA] Organization VPN async sync triggered", {
      jobId: raw.id,
    });
    return success({
      id: raw.id,
      orgResourceId: raw.orgResourceId,
      rootOrgResourceId: raw.rootOrgResourceId,
      status: raw.status,
      error: raw.error,
    });
  }
}
