import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  CorvinaPermissionLevel,
  CorvinaRoleOwner,
  CorvinaRoleType,
} from "../enums";
import type {
  CorvinaRoleDeleteResponseOutput,
  CorvinaRoleDeleteUrlVariablesOutput,
  CorvinaRoleGetResponseOutput,
  CorvinaRoleGetUrlVariablesOutput,
  CorvinaRolePutRequestOutput,
  CorvinaRolePutResponseOutput,
  CorvinaRolePutUrlVariablesOutput,
} from "./definition";

const ROLE_TYPE_MAP: Record<
  string,
  (typeof CorvinaRoleType)[keyof typeof CorvinaRoleType]
> = {
  APPLICATION: CorvinaRoleType.APPLICATION,
  DEVICE: CorvinaRoleType.DEVICE,
  UNDEFINED: CorvinaRoleType.UNDEFINED,
};

const ROLE_OWNER_MAP: Record<
  string,
  (typeof CorvinaRoleOwner)[keyof typeof CorvinaRoleOwner]
> = {
  SYSTEM: CorvinaRoleOwner.SYSTEM,
  ORGANIZATION: CorvinaRoleOwner.ORGANIZATION,
  APPLICATION: CorvinaRoleOwner.APPLICATION,
};

const PERMISSION_LEVEL_MAP: Record<
  string,
  (typeof CorvinaPermissionLevel)[keyof typeof CorvinaPermissionLevel]
> = {
  NONE: CorvinaPermissionLevel.NONE,
  REGULAR_USER: CorvinaPermissionLevel.REGULAR_USER,
  ADMINISTRATOR: CorvinaPermissionLevel.ADMINISTRATOR,
};

const ROLE_TYPE_TO_API: Record<
  (typeof CorvinaRoleType)[keyof typeof CorvinaRoleType],
  string
> = {
  [CorvinaRoleType.APPLICATION]: "APPLICATION",
  [CorvinaRoleType.DEVICE]: "DEVICE",
  [CorvinaRoleType.UNDEFINED]: "UNDEFINED",
};

const PERMISSION_LEVEL_TO_API: Record<
  (typeof CorvinaPermissionLevel)[keyof typeof CorvinaPermissionLevel],
  string
> = {
  [CorvinaPermissionLevel.NONE]: "NONE",
  [CorvinaPermissionLevel.REGULAR_USER]: "REGULAR_USER",
  [CorvinaPermissionLevel.ADMINISTRATOR]: "ADMINISTRATOR",
};

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
    type: ROLE_TYPE_MAP[raw.type] ?? CorvinaRoleType.UNDEFINED,
    owner: ROLE_OWNER_MAP[raw.owner] ?? CorvinaRoleOwner.ORGANIZATION,
    enabled: raw.enabled,
    defaultStar: raw.defaultStar,
    deviceGeneralPermission:
      PERMISSION_LEVEL_MAP[raw.deviceGeneralPermission] ??
      CorvinaPermissionLevel.NONE,
    vpnGeneralPermission:
      PERMISSION_LEVEL_MAP[raw.vpnGeneralPermission] ??
      CorvinaPermissionLevel.NONE,
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
          type: ROLE_TYPE_TO_API[data.type] ?? "UNDEFINED",
          defaultStar: data.defaultStar,
          deviceGeneralPermission:
            PERMISSION_LEVEL_TO_API[data.deviceGeneralPermission] ?? "NONE",
          vpnGeneralPermission:
            PERMISSION_LEVEL_TO_API[data.vpnGeneralPermission] ?? "NONE",
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
