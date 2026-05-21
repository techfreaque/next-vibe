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
  CorvinaOrganizationCreateRequestOutput,
  CorvinaOrganizationCreateResponseOutput,
} from "./definition";

export class CorvinaOrganizationCreateRepository {
  static async create(
    data: CorvinaOrganizationCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaOrganizationCreateResponseOutput>> {
    const result =
      await CorvinaClient.request<CorvinaOrganizationCreateResponseOutput>(
        {
          method: "POST",
          path: CORVINA_ORGS_PATH,
          body: {
            name: data.name,
            displayName: data.displayName ?? data.name,
            enabled: data.enabled ?? true,
          },
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Organization created", { orgId: result.data.orgId });
    return success(result.data);
  }
}
