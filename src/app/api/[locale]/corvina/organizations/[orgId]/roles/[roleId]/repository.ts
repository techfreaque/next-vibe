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
  CorvinaRoleDeleteResponseOutput,
  CorvinaRoleDeleteUrlVariablesOutput,
  CorvinaRoleGetResponseOutput,
  CorvinaRoleGetUrlVariablesOutput,
  CorvinaRolePutRequestOutput,
  CorvinaRolePutResponseOutput,
  CorvinaRolePutUrlVariablesOutput,
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
  deviceGeneralPermission: string;
  vpnGeneralPermission: string;
}

function mapRole(raw: CorvinaRoleApiData): CorvinaRoleGetResponseOutput {
  return {
    id: raw.id,
    name: raw.name,
    label: raw.label,
    resourceId: raw.resourceId,
    description: raw.description,
    type: raw.type as "APPLICATION" | "DEVICE" | "UNDEFINED",
    owner: raw.owner as "SYSTEM" | "ORGANIZATION" | "APPLICATION",
    enabled: raw.enabled,
    defaultStar: raw.defaultStar,
    deviceGeneralPermission: raw.deviceGeneralPermission as
      | "NONE"
      | "REGULAR_USER"
      | "ADMINISTRATOR",
    vpnGeneralPermission: raw.vpnGeneralPermission as
      | "NONE"
      | "REGULAR_USER"
      | "ADMINISTRATOR",
  };
}

export class CorvinaRoleByIdRepository {
  private static buildPath(orgId: number, roleId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/roles/${encodeURIComponent(roleId)}`;
  }

  static async getById(
    urlPathParams: CorvinaRoleGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaRoleGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaRoleApiData>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.roleId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapRole(result.data));
  }

  static async update(
    urlPathParams: CorvinaRolePutUrlVariablesOutput,
    data: CorvinaRolePutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaRolePutResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaRoleApiData>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.roleId),
        body: {
          ...(data.label !== undefined ? { label: data.label } : {}),
          ...(data.description !== undefined
            ? { description: data.description }
            : {}),
          type: data.type,
          defaultStar: data.defaultStar,
          deviceGeneralPermission: data.deviceGeneralPermission,
          vpnGeneralPermission: data.vpnGeneralPermission,
          modelPathPermissions: [],
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Role updated", {
      orgId: urlPathParams.orgId,
      roleId: urlPathParams.roleId,
    });
    return success(mapRole(result.data));
  }

  static async deleteRole(
    urlPathParams: CorvinaRoleDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaRoleDeleteResponseOutput>> {
    const result = await CorvinaClient.request<undefined>(
      {
        method: "DELETE",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.roleId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Role deleted", {
      orgId: urlPathParams.orgId,
      roleId: urlPathParams.roleId,
    });
    return success({ success: true, message: "Role deleted." });
  }
}
