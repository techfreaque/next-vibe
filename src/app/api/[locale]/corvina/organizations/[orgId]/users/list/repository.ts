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
  CorvinaUsersListResponseOutput,
  CorvinaUsersListUrlVariablesOutput,
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
  ownerRef: string | null;
}

interface CorvinaUsersPageApiData {
  content: CorvinaUserApiData[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface UserListQueryParams {
  orgId: number;
  page?: number;
  pageSize?: number;
}

export class CorvinaUsersListRepository {
  static async list(
    urlPathParams: CorvinaUsersListUrlVariablesOutput,
    queryParams: UserListQueryParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaUsersListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/users`;
    const result = await CorvinaClient.request<CorvinaUsersPageApiData>(
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
      users: result.data.content.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        country: u.country,
        serviceAccount: u.serviceAccount,
        mfaEnabled: u.mfaEnabled,
        owner: u.owner as "ORGANIZATION" | "APP",
        groupPoliciesEnabled: u.groupPoliciesEnabled,
        userImpersonation: u.userImpersonation,
      })),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }
}
