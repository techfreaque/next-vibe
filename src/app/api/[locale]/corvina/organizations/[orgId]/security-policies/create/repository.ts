import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { SecurityPolicyType } from "../enums";
import type {
  SecurityPoliciesCreateRequestOutput,
  SecurityPoliciesCreateResponseOutput,
  SecurityPoliciesCreateUrlVariablesOutput,
} from "./definition";

interface SecurityPolicyApiItem {
  id: number;
  name: string;
  type: string;
  organizationId: number;
  orgResourceId: string;
}

function mapPolicyType(
  raw: string,
): (typeof SecurityPolicyType)[keyof typeof SecurityPolicyType] {
  const valid = Object.values(SecurityPolicyType) as string[];
  if (valid.includes(raw)) {
    return raw as (typeof SecurityPolicyType)[keyof typeof SecurityPolicyType];
  }
  return SecurityPolicyType.STANDARD;
}

function parseHwIds(raw: string | undefined): string[] {
  if (!raw || raw.trim() === "") {
    return [];
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}

export class SecurityPoliciesCreateRepository {
  static async create(
    urlPathParams: SecurityPoliciesCreateUrlVariablesOutput,
    data: SecurityPoliciesCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SecurityPoliciesCreateResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/securityPolicies`;
    const result = await CorvinaClient.request<SecurityPolicyApiItem>(
      {
        method: "POST",
        path,
        body: {
          name: data.name,
          ...(data.description ? { description: data.description } : {}),
          ...(data.deviceHwIds
            ? { deviceHwIds: parseHwIds(data.deviceHwIds) }
            : {}),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Security policy created", {
      orgId: urlPathParams.orgId,
    });
    return success({
      id: result.data.id,
      nameResult: result.data.name,
      type: mapPolicyType(result.data.type),
      organizationId: result.data.organizationId,
      orgResourceId: result.data.orgResourceId,
    });
  }
}
