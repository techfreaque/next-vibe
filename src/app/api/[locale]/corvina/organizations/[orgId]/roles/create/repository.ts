import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { CorvinaPermissionLevel, CorvinaRoleType } from "../enums";
import type {
  CorvinaRoleCreateRequestOutput,
  CorvinaRoleCreateResponseOutput,
} from "./definition";

const ROLE_TYPE_MAP: Record<
  string,
  (typeof CorvinaRoleType)[keyof typeof CorvinaRoleType]
> = {
  APPLICATION: CorvinaRoleType.APPLICATION,
  DEVICE: CorvinaRoleType.DEVICE,
  UNDEFINED: CorvinaRoleType.UNDEFINED,
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
  type: string;
  enabled: boolean;
}

interface RoleCreateUrlParams {
  orgId: number;
}

export class CorvinaRoleCreateRepository {
  static async create(
    urlPathParams: RoleCreateUrlParams,
    data: CorvinaRoleCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaRoleCreateResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/roles`;
    const result = await CorvinaClient.request<CorvinaRoleApiData>(
      {
        method: "POST",
        path,
        body: {
          name: data.name,
          ...(data.label !== undefined ? { label: data.label } : {}),
          ...(data.description !== undefined
            ? { description: data.description }
            : {}),
          type: ROLE_TYPE_TO_API[data.type] ?? "UNDEFINED",
          enabled: data.enabled,
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
    logger.info("[CORVINA] Role created", {
      orgId: urlPathParams.orgId,
      name: data.name,
    });
    return success({
      id: result.data.id,
      nameResult: result.data.name,
      labelResult: result.data.label,
      typeResult: ROLE_TYPE_MAP[result.data.type] ?? CorvinaRoleType.UNDEFINED,
      enabledResult: result.data.enabled,
    });
  }
}
