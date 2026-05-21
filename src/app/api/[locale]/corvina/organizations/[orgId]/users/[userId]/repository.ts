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
  CorvinaUserDeleteResponseOutput,
  CorvinaUserDeleteUrlVariablesOutput,
  CorvinaUserGetResponseOutput,
  CorvinaUserGetUrlVariablesOutput,
  CorvinaUserPutRequestOutput,
  CorvinaUserPutResponseOutput,
  CorvinaUserPutUrlVariablesOutput,
} from "./definition";

interface CorvinaUserApiData {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  serviceAccount: boolean;
  groupPoliciesEnabled: boolean;
  userImpersonation: boolean;
  mfaEnabled: boolean;
  owner: string;
}

function mapUser(raw: CorvinaUserApiData): CorvinaUserGetResponseOutput {
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    country: raw.country,
    serviceAccount: raw.serviceAccount,
    mfaEnabled: raw.mfaEnabled,
    owner: raw.owner as "ORGANIZATION" | "APP",
    groupPoliciesEnabled: raw.groupPoliciesEnabled,
    userImpersonation: raw.userImpersonation,
  };
}

export class CorvinaUserByIdRepository {
  private static buildPath(orgId: number, userId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/users/${encodeURIComponent(userId)}`;
  }

  static async getById(
    urlPathParams: CorvinaUserGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaUserGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaUserApiData>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.userId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapUser(result.data));
  }

  static async update(
    urlPathParams: CorvinaUserPutUrlVariablesOutput,
    data: CorvinaUserPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaUserPutResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaUserApiData>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.userId),
        body: {
          email: data.email,
          ...(data.firstName !== undefined
            ? { firstName: data.firstName }
            : {}),
          ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
          ...(data.country !== undefined ? { country: data.country } : {}),
          ...(data.defaultHomePage !== undefined
            ? { defaultHomePage: data.defaultHomePage }
            : {}),
          ...(data.groupPoliciesEnabled !== undefined
            ? { groupPoliciesEnabled: data.groupPoliciesEnabled }
            : {}),
          ...(data.userImpersonation !== undefined
            ? { userImpersonation: data.userImpersonation }
            : {}),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User updated", {
      orgId: urlPathParams.orgId,
      userId: urlPathParams.userId,
    });
    return success(mapUser(result.data));
  }

  static async deleteUser(
    urlPathParams: CorvinaUserDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaUserDeleteResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaUserApiData>(
      {
        method: "DELETE",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.userId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User deleted", {
      orgId: urlPathParams.orgId,
      userId: urlPathParams.userId,
    });
    return success(mapUser(result.data));
  }
}
