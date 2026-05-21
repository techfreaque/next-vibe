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
  UserGroupsCreateRequestOutput,
  UserGroupsCreateResponseOutput,
  UserGroupsCreateUrlVariablesOutput,
} from "./definition";

interface UserGroupApiItem {
  id: number;
  name: string;
  organizationId: number;
  type: string;
  owner: string;
  membershipRole: string;
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

export class UserGroupsCreateRepository {
  static async create(
    urlPathParams: UserGroupsCreateUrlVariablesOutput,
    data: UserGroupsCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGroupsCreateResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/userGroups`;
    const result = await CorvinaClient.request<UserGroupApiItem>(
      {
        method: "POST",
        path,
        body: {
          name: data.name,
          ...(data.description ? { description: data.description } : {}),
          groupPoliciesEnabled: data.groupPoliciesEnabled,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User group created", { orgId: urlPathParams.orgId });
    return success({
      id: result.data.id,
      nameResult: result.data.name,
      organizationId: result.data.organizationId,
      type: mapGroupType(result.data.type),
      owner: mapGroupOwner(result.data.owner),
      membershipRole: mapMembershipRole(result.data.membershipRole),
    });
  }
}
