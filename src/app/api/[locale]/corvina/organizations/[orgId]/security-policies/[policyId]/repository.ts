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
  SecurityPolicyDetailDeleteResponseOutput,
  SecurityPolicyDetailDeleteUrlVariablesOutput,
  SecurityPolicyDetailGetResponseOutput,
  SecurityPolicyDetailGetUrlVariablesOutput,
  SecurityPolicyDetailPutRequestOutput,
  SecurityPolicyDetailPutResponseOutput,
  SecurityPolicyDetailPutUrlVariablesOutput,
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

function mapPolicy(p: SecurityPolicyApiItem): {
  id: number;
  name: string;
  type: (typeof SecurityPolicyType)[keyof typeof SecurityPolicyType];
  organizationId: number;
  orgResourceId: string;
} {
  return {
    id: p.id,
    name: p.name,
    type: mapPolicyType(p.type),
    organizationId: p.organizationId,
    orgResourceId: p.orgResourceId,
  };
}

export class SecurityPolicyDetailRepository {
  private static buildPath(orgId: number, policyId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/securityPolicies/${encodeURIComponent(policyId)}`;
  }

  static async getById(
    urlPathParams: SecurityPolicyDetailGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SecurityPolicyDetailGetResponseOutput>> {
    const result = await CorvinaClient.request<SecurityPolicyApiItem>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.policyId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapPolicy(result.data));
  }

  static async update(
    urlPathParams: SecurityPolicyDetailPutUrlVariablesOutput,
    data: SecurityPolicyDetailPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SecurityPolicyDetailPutResponseOutput>> {
    const result = await CorvinaClient.request<SecurityPolicyApiItem>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.policyId),
        body: {
          name: data.name,
          ...(data.description ? { description: data.description } : {}),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Security policy updated", {
      orgId: urlPathParams.orgId,
      policyId: urlPathParams.policyId,
    });
    const mapped = mapPolicy(result.data);
    return success({
      ...mapped,
      nameResult: mapped.name,
      orgId: urlPathParams.orgId,
      policyId: urlPathParams.policyId,
    });
  }

  static async deleteById(
    urlPathParams: SecurityPolicyDetailDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SecurityPolicyDetailDeleteResponseOutput>> {
    const result = await CorvinaClient.request<SecurityPolicyApiItem>(
      {
        method: "DELETE",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.policyId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Security policy deleted", {
      orgId: urlPathParams.orgId,
      policyId: urlPathParams.policyId,
    });
    return success(mapPolicy(result.data));
  }
}
