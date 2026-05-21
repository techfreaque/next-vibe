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
  CorvinaSubOrgCreateRequestOutput,
  CorvinaSubOrgCreateResponseOutput,
} from "./definition";

interface CorvinaOrgOutApiData {
  id: number;
  name: string;
  label: string;
  status: string;
  resourceId: string;
}

interface CorvinaSubOrgUrlParams {
  orgId: number;
}

export class CorvinaSubOrgRepository {
  static async create(
    urlPathParams: CorvinaSubOrgUrlParams,
    data: CorvinaSubOrgCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaSubOrgCreateResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}`;
    const result = await CorvinaClient.request<CorvinaOrgOutApiData>(
      {
        method: "POST",
        path,
        body: {
          name: data.name,
          ...(data.label !== undefined ? { label: data.label } : {}),
          privateAccess: data.privateAccess,
          allowDisablePrivateAccess: data.allowDisablePrivateAccess,
          allowHostname: data.allowHostname,
          ...(data.hostname !== undefined ? { hostname: data.hostname } : {}),
          dataEnabled: data.dataEnabled,
          vpnEnabled: data.vpnEnabled,
          storeEnabled: data.storeEnabled,
          mfaRequired: data.mfaRequired,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Sub-organization created", {
      parentOrgId: urlPathParams.orgId,
      name: data.name,
    });
    return success({
      id: result.data.id,
      nameResult: result.data.name,
      labelResult: result.data.label,
      status: result.data.status,
      resourceId: result.data.resourceId,
    });
  }
}
