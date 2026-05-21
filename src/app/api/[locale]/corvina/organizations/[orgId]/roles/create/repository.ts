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
  CorvinaRoleCreateRequestOutput,
  CorvinaRoleCreateResponseOutput,
} from "./definition";

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
          type: data.type,
          enabled: data.enabled,
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
    logger.info("[CORVINA] Role created", {
      orgId: urlPathParams.orgId,
      name: data.name,
    });
    return success({
      id: result.data.id,
      nameResult: result.data.name,
      labelResult: result.data.label,
      typeResult: result.data.type as "APPLICATION" | "DEVICE" | "UNDEFINED",
      enabledResult: result.data.enabled,
    });
  }
}
