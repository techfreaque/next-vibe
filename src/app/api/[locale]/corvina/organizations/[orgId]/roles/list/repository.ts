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
  CorvinaRolesListResponseOutput,
  CorvinaRolesListUrlVariablesOutput,
} from "./definition";

interface CorvinaRoleApiData {
  id: number;
  name: string;
  label: string | null;
  resourceId: string;
  description: string | null;
  type: string;
  owner: string;
  enabled: boolean;
  defaultStar: boolean;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  deviceGeneralPermission: string;
  vpnGeneralPermission: string;
  orgResourceId: string;
}

interface CorvinaRolesPageApiData {
  content: CorvinaRoleApiData[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface RoleListQueryParams {
  orgId: number;
  page?: number;
  pageSize?: number;
}

export class CorvinaRolesListRepository {
  static async list(
    urlPathParams: CorvinaRolesListUrlVariablesOutput,
    queryParams: RoleListQueryParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaRolesListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/roles`;
    const result = await CorvinaClient.request<CorvinaRolesPageApiData>(
      {
        method: "GET",
        path,
        query: {
          page: queryParams.page ?? 0,
          size: queryParams.pageSize ?? 20,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      roles: result.data.content.map((r) => ({
        id: r.id,
        name: r.name,
        label: r.label,
        resourceId: r.resourceId,
        description: r.description,
        type: r.type as "APPLICATION" | "DEVICE" | "UNDEFINED",
        owner: r.owner as "SYSTEM" | "ORGANIZATION" | "APPLICATION",
        enabled: r.enabled,
        defaultStar: r.defaultStar,
        deviceGeneralPermission: r.deviceGeneralPermission as
          | "NONE"
          | "REGULAR_USER"
          | "ADMINISTRATOR",
        vpnGeneralPermission: r.vpnGeneralPermission as
          | "NONE"
          | "REGULAR_USER"
          | "ADMINISTRATOR",
      })),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }
}
