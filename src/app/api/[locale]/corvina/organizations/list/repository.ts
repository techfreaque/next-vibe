import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { CorvinaOrgStatus } from "../enums";
import type { CorvinaOrganizationsListResponseOutput } from "./definition";

// TODO: replace with dynamic org selection
const ROOT_ORG_ID = 45564;

const TERMINAL_STATUSES = new Set(["NEW", "DONE", "DELETING", "DELETED"]);

function mapOrgStatus(
  raw: string,
): (typeof CorvinaOrgStatus)[keyof typeof CorvinaOrgStatus] {
  if (TERMINAL_STATUSES.has(raw)) {
    return CorvinaOrgStatus[raw as "NEW" | "DONE" | "DELETING" | "DELETED"];
  }
  return CorvinaOrgStatus.PROVISIONING;
}

interface CorvinaOrgListItem {
  id: number;
  name: string;
  label: string;
  status: string;
  resourceId: string;
  dataEnabled: boolean;
  vpnEnabled: boolean;
}

interface CorvinaOrgsPageResponse {
  content: CorvinaOrgListItem[];
  totalElements: number;
}

export class CorvinaOrganizationsListRepository {
  static async list(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrganizationsListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${ROOT_ORG_ID}/organizations`;
    const result = await CorvinaClient.request<CorvinaOrgsPageResponse>(
      {
        method: "GET",
        path,
        query: {
          includePrivateAccess: false,
          onlyFirstLevel: false,
          page: 0,
          pageSize: 10,
          orderBy: "id",
          orderDir: "ASC",
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      organizations: result.data.content.map((org) => ({
        id: org.id,
        name: org.name,
        label: org.label,
        status: mapOrgStatus(org.status),
        resourceId: org.resourceId,
        dataEnabled: org.dataEnabled,
        vpnEnabled: org.vpnEnabled,
      })),
      total: result.data.totalElements,
    });
  }
}
