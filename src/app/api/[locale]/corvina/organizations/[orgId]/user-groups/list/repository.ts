import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { MembershipRole, UserGroupOwner, UserGroupType } from "../enums";
import type {
  UserGroupsListRequestOutput,
  UserGroupsListResponseOutput,
  UserGroupsListUrlVariablesOutput,
} from "./definition";

interface UserGroupApiItem {
  id: number;
  name: string;
  organizationId: number;
  type: string;
  owner: string;
  membershipRole: string;
}

interface UserGroupPageResponse {
  content: UserGroupApiItem[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

function mapGroupType(
  raw: string,
): (typeof UserGroupType)[keyof typeof UserGroupType] {
  const valid = Object.values(UserGroupType) as string[];
  if (valid.includes(raw)) {
    return raw as (typeof UserGroupType)[keyof typeof UserGroupType];
  }
  return UserGroupType.STANDARD;
}

function mapGroupOwner(
  raw: string,
): (typeof UserGroupOwner)[keyof typeof UserGroupOwner] {
  const valid = Object.values(UserGroupOwner) as string[];
  if (valid.includes(raw)) {
    return raw as (typeof UserGroupOwner)[keyof typeof UserGroupOwner];
  }
  return UserGroupOwner.ORGANIZATION;
}

function mapMembershipRole(
  raw: string,
): (typeof MembershipRole)[keyof typeof MembershipRole] {
  const valid = Object.values(MembershipRole) as string[];
  if (valid.includes(raw)) {
    return raw as (typeof MembershipRole)[keyof typeof MembershipRole];
  }
  return MembershipRole.USER;
}

export class UserGroupsListRepository {
  static async list(
    urlPathParams: UserGroupsListUrlVariablesOutput,
    data: UserGroupsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGroupsListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/userGroups`;
    const result = await CorvinaClient.request<UserGroupPageResponse>(
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
      groups: result.data.content.map((g) => ({
        id: g.id,
        name: g.name,
        organizationId: g.organizationId,
        type: mapGroupType(g.type),
        owner: mapGroupOwner(g.owner),
        membershipRole: mapMembershipRole(g.membershipRole),
      })),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }
}
