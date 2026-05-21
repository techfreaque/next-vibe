import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CorvinaOrganizationsListResponseOutput } from "./definition";

// TODO: replace with dynamic org selection
const ROOT_ORG_ID = 45564;

export class CorvinaOrganizationsListRepository {
  static async list(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrganizationsListResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${ROOT_ORG_ID}/organizations`;
    const result = await CorvinaClient.request<{
      content: CorvinaOrganizationsListResponseOutput["organizations"];
      totalElements: number;
    }>(
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
      organizations: result.data.content,
      total: result.data.totalElements,
    });
  }
}
