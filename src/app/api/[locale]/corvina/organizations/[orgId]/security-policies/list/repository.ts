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
  SecurityPoliciesListRequestOutput,
  SecurityPoliciesListResponseOutput,
  SecurityPoliciesListUrlVariablesOutput,
} from "./definition";

interface SecurityPolicyApiItem {
  id: number;
  name: string;
  type: string;
  organizationId: number;
  orgResourceId: string;
}

interface SecurityPolicyPageResponse {
  content: SecurityPolicyApiItem[];
  totalElements: number;
  totalPages: number;
  last: boolean;
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

export class SecurityPoliciesListRepository {
  static async list(
    urlPathParams: SecurityPoliciesListUrlVariablesOutput,
    data: SecurityPoliciesListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SecurityPoliciesListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/securityPolicies`;
    const result = await CorvinaClient.request<SecurityPolicyPageResponse>(
      {
        method: "GET",
        path,
        query: {
          page: data.page,
          pageSize: data.pageSize,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      policies: result.data.content.map((p) => ({
        id: p.id,
        name: p.name,
        type: mapPolicyType(p.type),
        organizationId: p.organizationId,
        orgResourceId: p.orgResourceId,
      })),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }
}
