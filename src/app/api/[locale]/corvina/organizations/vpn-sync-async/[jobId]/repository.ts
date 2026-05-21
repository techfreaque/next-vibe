import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  OrganizationsVpnSyncAsyncJobResponseOutput,
  OrganizationsVpnSyncAsyncJobUrlParamsOutput,
} from "./definition";

interface CorvinaSyncVpnJob {
  id: string | null;
  orgResourceId: string | null;
  rootOrgResourceId: string | null;
  status: string | null;
  error: string | null;
}

export class OrganizationsVpnSyncAsyncJobRepository {
  static async getById(
    urlPathParams: OrganizationsVpnSyncAsyncJobUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<OrganizationsVpnSyncAsyncJobResponseOutput>> {
    const path = `/api/v1/organizations/vpn/sync/async/${encodeURIComponent(urlPathParams.jobId)}`;

    const result = await CorvinaClient.request<CorvinaSyncVpnJob>(
      {
        method: "GET",
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
    logger.info("[CORVINA] VPN sync job fetched", {
      jobId: urlPathParams.jobId,
    });
    return success({
      jobId: urlPathParams.jobId,
      id: raw.id,
      orgResourceId: raw.orgResourceId,
      rootOrgResourceId: raw.rootOrgResourceId,
      status: raw.status,
      error: raw.error,
    });
  }
}
