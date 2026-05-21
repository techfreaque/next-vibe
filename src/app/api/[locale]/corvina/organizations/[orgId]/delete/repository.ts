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
  CorvinaOrgDeleteResponseOutput,
  CorvinaOrgDeleteUrlVariablesOutput,
} from "./definition";

interface CorvinaOrgDeleteApiData {
  id: number;
  name: string;
  label: string;
  status: string;
  resourceId: string;
}

export class CorvinaOrgDeleteRepository {
  static async deleteOrg(
    urlPathParams: CorvinaOrgDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrgDeleteResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}`;
    const result = await CorvinaClient.request<CorvinaOrgDeleteApiData>(
      { method: "DELETE", path },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Organization deleted", {
      orgId: urlPathParams.orgId,
    });
    return success({
      id: result.data.id,
      name: result.data.name,
      label: result.data.label,
      status: result.data.status,
      resourceId: result.data.resourceId,
    });
  }
}
