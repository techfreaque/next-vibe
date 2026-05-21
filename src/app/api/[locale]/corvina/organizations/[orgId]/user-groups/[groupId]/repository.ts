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
  UserGroupDetailDeleteResponseOutput,
  UserGroupDetailDeleteUrlVariablesOutput,
  UserGroupDetailGetResponseOutput,
  UserGroupDetailGetUrlVariablesOutput,
  UserGroupDetailPutRequestOutput,
  UserGroupDetailPutResponseOutput,
  UserGroupDetailPutUrlVariablesOutput,
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

function mapGroup(g: UserGroupApiItem): {
  id: number;
  name: string;
  organizationId: number;
  type: (typeof UserGroupType)[keyof typeof UserGroupType];
  owner: (typeof UserGroupOwner)[keyof typeof UserGroupOwner];
  membershipRole: (typeof MembershipRole)[keyof typeof MembershipRole];
} {
  return {
    id: g.id,
    name: g.name,
    organizationId: g.organizationId,
    type: mapGroupType(g.type),
    owner: mapGroupOwner(g.owner),
    membershipRole: mapMembershipRole(g.membershipRole),
  };
}

function parseIds(raw: string | undefined): number[] {
  if (!raw || raw.trim() === "") {
    return [];
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n));
}

export class UserGroupDetailRepository {
  private static buildPath(orgId: number, groupId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/userGroups/${encodeURIComponent(groupId)}`;
  }

  static async getById(
    urlPathParams: UserGroupDetailGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGroupDetailGetResponseOutput>> {
    const result = await CorvinaClient.request<UserGroupApiItem>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.groupId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(mapGroup(result.data));
  }

  static async update(
    urlPathParams: UserGroupDetailPutUrlVariablesOutput,
    data: UserGroupDetailPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGroupDetailPutResponseOutput>> {
    const result = await CorvinaClient.request<UserGroupApiItem>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.groupId),
        body: {
          membersId: parseIds(data.membersId),
          rolesId: parseIds(data.rolesId),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User group updated", {
      orgId: urlPathParams.orgId,
      groupId: urlPathParams.groupId,
    });
    const mapped = mapGroup(result.data);
    return success({
      ...mapped,
      orgId: urlPathParams.orgId,
      groupId: urlPathParams.groupId,
    });
  }

  static async deleteById(
    urlPathParams: UserGroupDetailDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserGroupDetailDeleteResponseOutput>> {
    const result = await CorvinaClient.request<UserGroupApiItem>(
      {
        method: "DELETE",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.groupId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User group deleted", {
      orgId: urlPathParams.orgId,
      groupId: urlPathParams.groupId,
    });
    return success(mapGroup(result.data));
  }
}
